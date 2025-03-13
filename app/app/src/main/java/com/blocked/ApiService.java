package com.blocked;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.Executors;

public class ApiService extends Service {
    private static final String TAG = "ApiService";
    private static final String API_URL = "http://192.168.105.31:3000/api/app"; // Altere conforme necessário
    private static final int INTERVAL_MS = 500; // 10 segundos

    private final Handler handler = new Handler();
    private Runnable apiRequestRunnable;

    @Override
    public void onCreate() {
        super.onCreate();
        startForegroundService();
        startPeriodicRequests();
    }

    private void startForegroundService() {
        String channelId = "ApiServiceChannel";
        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    channelId,
                    "API Service",
                    NotificationManager.IMPORTANCE_LOW
            );
            notificationManager.createNotificationChannel(channel);
        }

        Notification notification = new Notification.Builder(this, channelId)
                .setContentTitle("API Service")
                .setContentText("Consultando API periodicamente")
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .build();

        startForeground(1, notification);
    }

    private void startPeriodicRequests() {
        apiRequestRunnable = new Runnable() {
            @Override
            public void run() {
                fetchDataFromApi();
                handler.postDelayed(this, INTERVAL_MS);
            }
        };
        handler.post(apiRequestRunnable);
    }

    private void fetchDataFromApi() {
        Executors.newSingleThreadExecutor().execute(() -> {
            HttpURLConnection connection = null;
            try {
                URL url = new URL(API_URL);
                connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");
                connection.setRequestProperty("Accept", "application/json");
                connection.setConnectTimeout(5000);
                connection.setReadTimeout(5000);

                int responseCode = connection.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                    StringBuilder response = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        response.append(line);
                    }
                    reader.close();
                    Log.d(TAG, "API Response: " + response.toString());
                } else {
                    Log.e(TAG, "Erro na requisição: " + responseCode);
                }
            } catch (Exception e) {
                Log.e(TAG, "Erro na conexão com a API", e);
            } finally {
                if (connection != null) {
                    connection.disconnect();
                }
            }
        });
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        handler.removeCallbacks(apiRequestRunnable);
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
