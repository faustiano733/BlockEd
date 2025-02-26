package com.blocked;

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
import android.content.BroadcastReceiver;
import android.content.IntentFilter;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

public class LocationService extends Service {

    private static final String CHANNEL_ID = "LocationServiceChannel";
    private static final int NOTIFICATION_ID = 2;
    private LocationManager locationManager;
    private LocationListener locationListener;
    public static final String ACTION_LOCATION_UPDATE = "com.exemplo.meuapp.ACTION_LOCATION_UPDATE";
    public static final String EXTRA_LATITUDE = "extra_latitude";
    public static final String EXTRA_LONGITUDE = "extra_longitude";

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
        startLocationUpdates();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // Criar a notificação
        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Monitorando Localização")
                .setContentText("Obtendo coordenadas em tempo real")
                .setSmallIcon(R.drawable.ic_launcher_foreground) // Ícone obrigatório
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .build();

        // Iniciar como Foreground Service
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

    private void startLocationUpdates() {
        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
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
                        1000, // Intervalo de atualização em milissegundos (1 segundo)
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
}