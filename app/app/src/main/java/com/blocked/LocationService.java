package com.blocked;

import android.Manifest;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import androidx.core.app.NotificationCompat;
import androidx.core.app.ActivityCompat;
import android.content.BroadcastReceiver;
import android.net.Uri;


import android.content.IntentFilter;
import android.content.pm.PackageManager;
import androidx.core.app.ActivityCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import org.json.JSONObject;
import org.json.JSONArray;

import java.io.File;
import java.io.FileReader;
import java.io.BufferedReader;

public class LocationService extends Service {

    private static final String CHANNEL_ID = "LocationServiceChannel";
    private static final int NOTIFICATION_ID = 2;
    private LocationManager locationManager;
    private LocationListener locationListener;
    public static final String ACTION_LOCATION_UPDATE = "com.blocked.ACTION_LOCATION_UPDATE";
    public static final String EXTRA_LATITUDE = "extra_latitude";
    public static final String EXTRA_LONGITUDE = "extra_longitude";
    private static double SCHOOL_LATITUDE;
    private static double SCHOOL_LONGITUDE;
    private static double RADIUS_METERS;
    private static boolean block_internet;
    private static boolean block_cam;
    private static boolean block_sites;
    private static boolean block_apps;
    private Handler updateHandler = new Handler();
    private Handler permissionHandler = new Handler();
    private boolean resetUpdates = false;
    private static final String FILE_PATH = "/storage/emulated/0/Documents/blocked_config.json";
    //private static final String EX_FILE_PATH = "/storage/emulated/0/Documents/blocked_exceptions.txt";

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
        updateInfo();
        
        startLocationUpdates();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Monitorando Localização")
                .setContentText("Obtendo coordenadas em tempo real")
                .setSmallIcon(R.drawable.ic_launcher_foreground) // Ícone obrigatório
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .build();

        
        startForeground(NOTIFICATION_ID, notification);
        startUpdatingInfo();
        startPermissionUpdates();

        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        stopLocationUpdates();
        showNotification("LocationService destruído");
        updateHandler.removeCallbacksAndMessages(null);
        permissionHandler.removeCallbacksAndMessages(null);
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Canal do Serviço de Localização",
                    NotificationManager.IMPORTANCE_LOW
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            manager.createNotificationChannel(channel);
        }
    }

    private void showNotification(String message) {
    NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

    String channelId = "location_service_channel";
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        NotificationChannel channel = new NotificationChannel(
            channelId,
            "Location Service",
            NotificationManager.IMPORTANCE_DEFAULT
        );
        notificationManager.createNotificationChannel(channel);
    }

    Notification notification = new NotificationCompat.Builder(this, channelId)
        .setContentTitle("Localização")
        .setContentText(message)
        .setSmallIcon(R.drawable.ic_launcher_foreground)
        .setPriority(NotificationCompat.PRIORITY_DEFAULT)
        .build();

    notificationManager.notify(1, notification);
    }

    private void startLocationUpdates() {
        stopLocationUpdates(); // <- Garante que não vai acumular listeners

        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // Se a permissão foi revogada, pare o serviço

            /*Intent intent = new Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            intent.setData(Uri.parse("package:" + getPackageName()));
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
            */
            showNotification("Permissão revogada");
            //stopSelf();
            return;
        }

        locationListener = new LocationListener() {
            /*@Override
            public void onLocationChanged(Location location) {
                if (location == null) {
                    showNotification("Erro: localização nula recebida");
                    return;
                }

                if(Functions.isException(LocationService.this)){
                    stopService(new Intent(LocationService.this, CamMonitorService.class));
                    stopService(new Intent(LocationService.this, AppMonitorService.class));
                    
                    Intent stopIntent = new Intent(LocationService.this, InternetBlockerService.class);
                    stopIntent.setAction("STOP_VPN");
                    startService(stopIntent);

                    Intent stopSiteIntent = new Intent(LocationService.this, SiteBlockerService.class);
                    stopSiteIntent.setAction("STOP_VPN");
                    startService(stopSiteIntent);
                    return;
                }

                double latitude = location.getLatitude();
                double longitude = location.getLongitude();

                // Enviar coordenadas para a MainActivity
                Intent intent = new Intent(ACTION_LOCATION_UPDATE);
                intent.putExtra(EXTRA_LATITUDE, latitude);
                intent.putExtra(EXTRA_LONGITUDE, longitude);
                LocalBroadcastManager.getInstance(LocationService.this).sendBroadcast(intent);

                double distance = calculateDistance(latitude, longitude, SCHOOL_LATITUDE, SCHOOL_LONGITUDE) * 1000; // Converter para metros

                //startService(new Intent(LocationService.this, ApiService.class));
                if (distance <= RADIUS_METERS) {
                    showNotification("Você está na área da escola!:"+distance+"m");

                    if(block_cam)
                        startService(new Intent(LocationService.this, CamMonitorService.class));
                    else
                        stopService(new Intent(LocationService.this, CamMonitorService.class));

                    if(block_apps)
                        startService(new Intent(LocationService.this, AppMonitorService.class));
                    else
                        stopService(new Intent(LocationService.this, AppMonitorService.class));


                    if(block_internet)
                        startService(new Intent(LocationService.this, InternetBlockerService.class));
                    else{
                        Intent stopIntent = new Intent(LocationService.this, InternetBlockerService.class);
                        stopIntent.setAction("STOP_VPN");
                        startService(stopIntent);

                        if(block_sites)
                            startService(new Intent(LocationService.this, SiteBlockerService.class));
                        else{
                            Intent stopSiteIntent = new Intent(LocationService.this, SiteBlockerService.class);
                            stopSiteIntent.setAction("STOP_VPN");
                            startService(stopSiteIntent);
                        }
                    }
                } else {
                    showNotification("Você saiu da área da escola!:"+distance+"m");
                    stopService(new Intent(LocationService.this, CamMonitorService.class));
                    stopService(new Intent(LocationService.this, AppMonitorService.class));
                    
                    Intent stopIntent = new Intent(LocationService.this, InternetBlockerService.class);
                    stopIntent.setAction("STOP_VPN");
                    startService(stopIntent);

                    Intent stopSiteIntent = new Intent(LocationService.this, SiteBlockerService.class);
                    stopSiteIntent.setAction("STOP_VPN");
                    startService(stopSiteIntent);
                }
            }
            */

            @Override
public void onLocationChanged(Location location) {
    try {
        if (location == null) {
            showNotification("Erro: localização nula recebida");
            return;
        }

        if (Functions.isException(LocationService.this)) {
            stopService(new Intent(LocationService.this, CamMonitorService.class));
            stopService(new Intent(LocationService.this, AppMonitorService.class));
            
            Intent stopIntent = new Intent(LocationService.this, InternetBlockerService.class);
            stopIntent.setAction("STOP_VPN");
            startService(stopIntent);

            Intent stopSiteIntent = new Intent(LocationService.this, SiteBlockerService.class);
            stopSiteIntent.setAction("STOP_VPN");
            startService(stopSiteIntent);
            return;
        }

        double latitude = location.getLatitude();
        double longitude = location.getLongitude();

        Intent intent = new Intent(ACTION_LOCATION_UPDATE);
        intent.putExtra(EXTRA_LATITUDE, latitude);
        intent.putExtra(EXTRA_LONGITUDE, longitude);
        LocalBroadcastManager.getInstance(LocationService.this).sendBroadcast(intent);

        double distance = calculateDistance(latitude, longitude, SCHOOL_LATITUDE, SCHOOL_LONGITUDE) * 1000;

        if (distance <= RADIUS_METERS) {
            showNotification("Você está na área da escola!:" + distance + "m");

            if (block_cam)
                startService(new Intent(LocationService.this, CamMonitorService.class));
            else
                stopService(new Intent(LocationService.this, CamMonitorService.class));

            if (block_apps)
                startService(new Intent(LocationService.this, AppMonitorService.class));
            else
                stopService(new Intent(LocationService.this, AppMonitorService.class));

            if (block_internet)
                startService(new Intent(LocationService.this, InternetBlockerService.class));
            else {
                Intent stopIntent = new Intent(LocationService.this, InternetBlockerService.class);
                stopIntent.setAction("STOP_VPN");
                startService(stopIntent);

                if (block_sites)
                    startService(new Intent(LocationService.this, SiteBlockerService.class));
                else {
                    Intent stopSiteIntent = new Intent(LocationService.this, SiteBlockerService.class);
                    stopSiteIntent.setAction("STOP_VPN");
                    startService(stopSiteIntent);
                }
            }
        } else {
            showNotification("Você saiu da área da escola!:" + distance + "m");
            stopService(new Intent(LocationService.this, CamMonitorService.class));
            stopService(new Intent(LocationService.this, AppMonitorService.class));
            
            Intent stopIntent = new Intent(LocationService.this, InternetBlockerService.class);
            stopIntent.setAction("STOP_VPN");
            startService(stopIntent);

            Intent stopSiteIntent = new Intent(LocationService.this, SiteBlockerService.class);
            stopSiteIntent.setAction("STOP_VPN");
            startService(stopSiteIntent);
        }
    } catch (SecurityException e) {
        showNotification("Permissão foi revogada em tempo real.");
        stopLocationUpdates();
    } catch (Exception e) {
        showNotification("Erro inesperado: " + e.getMessage());
    }
}

            @Override
            public void onStatusChanged(String provider, int status, Bundle extras) {}

            @Override
            public void onProviderEnabled(String provider) {}

            @Override
            public void onProviderDisabled(String provider) {
                checkAndPromptGPS();
            }
        };

        // Solicitar atualizações de localização via GPS
        if (locationManager != null) {
            try {
                locationManager.requestLocationUpdates(
                        LocationManager.GPS_PROVIDER, // Usar GPS
                        3000, // Intervalo de atualização em milissegundos
                        1, // Distância mínima em metros
                        locationListener,
                        Looper.getMainLooper()
                );
            } catch (SecurityException e) {
                showNotification("Erro ao registrar localização: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }

    private void stopLocationUpdates() {
        if (locationManager != null && locationListener != null) {
            locationManager.removeUpdates(locationListener);
        }
    }

    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double EARTH_RADIUS = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c; // Distância em quilômetros
    }

    private void updateInfo(){
        File file = new File(FILE_PATH);

        if(!file.exists()){
            return;
        }

        StringBuilder content = new StringBuilder();

        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line);
                //blockedApps.add(line.trim());
            }

            JSONObject jsonObject = new JSONObject(content.toString());

            RADIUS_METERS = Double.parseDouble(jsonObject.getString("raio"));
            SCHOOL_LATITUDE = Double.parseDouble(jsonObject.getString("latitude"));
            SCHOOL_LONGITUDE = Double.parseDouble(jsonObject.getString("longitude"));

            block_cam = jsonObject.getString("block_cam").equals("1");
            block_internet = jsonObject.getString("block_internet").equals("1");
            block_apps = jsonObject.getString("block_apps").equals("1");
            block_sites = jsonObject.getString("block_sites").equals("1");

            //System.out.println(block_cam);
            //System.out.println(block_internet);
            //System.out.println(block_apps);
            //System.out.println(block_sites);
            //System.out.println(SCHOOL_LATITUDE);
            //System.out.println(SCHOOL_LONGITUDE);
            //System.out.println(RADIUS_METERS);
        
        } catch (Exception e) {
            //return new String[0];
        }

    }

    private Runnable updateInfoRunnable = new Runnable() {
        @Override
        public void run() {
            updateInfo();

            updateHandler.postDelayed(this, 10000);
        }
    };

    private void startUpdatingInfo(){
        updateHandler.removeCallbacks(updateInfoRunnable);
        updateHandler.post(updateInfoRunnable);
    }

    private Runnable permissionRunnable = new Runnable() {
        @Override
        public void run() {
            boolean hasPermission = ActivityCompat.checkSelfPermission(LocationService.this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;

            if (!hasPermission) {
                resetUpdates = true;
                //stopLocationUpdates();
                showNotification("Permissão de localização foi revogada");

                /*Intent intent = new Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                intent.setData(Uri.parse("package:" + getPackageName()));
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
                */
            }

            if (hasPermission && resetUpdates) {
                resetUpdates = false;
                showNotification("Permissão restaurada. Reiniciando localização.");
                //new Handler(Looper.getMainLooper()).postDelayed(() -> startLocationUpdates(), 2000);
            }

            permissionHandler.postDelayed(this, 10000);
        }
    };

    private void startPermissionUpdates(){
        permissionHandler.removeCallbacks(permissionRunnable);
        permissionHandler.post(permissionRunnable);
    }

    private boolean isLocationEnabled() {
        try{
            LocationManager lM = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
            return lM.isProviderEnabled(LocationManager.GPS_PROVIDER);    
        } catch(Exception e) {
            e.printStackTrace();
        }
        
        return false;
    }

    private void checkAndPromptGPS() {
        if (!isLocationEnabled()) {
            showNotification("Por favor, ative o GPS para continuar.");

            Intent intent = new Intent(android.provider.Settings.ACTION_LOCATION_SOURCE_SETTINGS);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);

            // Rechecar depois de 10 segundos
            new Handler(Looper.getMainLooper()).postDelayed(this::checkAndPromptGPS, 10000);
        } else {
            showNotification("GPS ativado. Obrigado!");
        }
    }

}