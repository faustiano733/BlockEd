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
import android.os.IBinder;
import android.os.Looper;
import androidx.core.app.NotificationCompat;
import androidx.core.app.ActivityCompat;
import android.content.BroadcastReceiver;


import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import androidx.core.app.ActivityCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

public class LocationService extends Service {

    private static final String CHANNEL_ID = "LocationServiceChannel";
    private static final int NOTIFICATION_ID = 2;
    private LocationManager locationManager;
    private LocationListener locationListener;
    public static final String ACTION_LOCATION_UPDATE = "com.blocked.ACTION_LOCATION_UPDATE";
    public static final String EXTRA_LATITUDE = "extra_latitude";
    public static final String EXTRA_LONGITUDE = "extra_longitude";
    private static final double SCHOOL_LATITUDE = -8.856175;
    private static final double SCHOOL_LONGITUDE = 13.283878;
    private static final double RADIUS_METERS = 1000; // metros

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
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

        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        stopLocationUpdates();
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
        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // Se a permissão foi revogada, pare o serviço
            stopSelf();
            return;
        }

        locationListener = new LocationListener() {
            @Override
            public void onLocationChanged(Location location) {
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
                    startService(new Intent(LocationService.this, CamMonitorService.class));
                    startService(new Intent(LocationService.this, AppMonitorService.class));
                    startService(new Intent(LocationService.this, SiteBlockerService.class));
                } else {
                    showNotification("Você saiu da área da escola!:"+distance+"m");
                    stopService(new Intent(LocationService.this, CamMonitorService.class));
                    stopService(new Intent(LocationService.this, AppMonitorService.class));
                    stopService(new Intent(LocationService.this, SiteBlockerService.class));
                }
            }

            @Override
            public void onStatusChanged(String provider, int status, Bundle extras) {}

            @Override
            public void onProviderEnabled(String provider) {}

            @Override
            public void onProviderDisabled(String provider) {}
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
}