package com.blocked;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Environment;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.Executors;

import java.io.File;
import java.io.FileReader;
import java.io.BufferedReader;
import java.io.FileWriter;

import org.json.JSONObject;
import org.json.JSONArray;

public class ApiService extends Service {
    private static final String TAG = "ApiService";
    private static final String API_URL = "http://192.168.105.13:3000/api/app"; // Altere conforme necessário
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

                    JSONArray jsonArray = new JSONArray(response.toString());

                    // 2️⃣ Extrai apenas os "packageName" e cria um novo JSONArray
                    JSONArray blockedApps = new JSONArray();
                    for (int i = 0; i < jsonArray.length(); i++) {
                        JSONObject obj = jsonArray.getJSONObject(i);
                        blockedApps.put(obj.getString("packageName"));
                    }

                    // 3️⃣ Lê o arquivo blocked_config.json
                    File documentsDir = new File(Environment.getExternalStorageDirectory(), "Documents");
                    File file = new File(documentsDir, "blocked_config.json");
                    JSONObject configJson;
                
                    if (file.exists()) {
                        BufferedReader reader1 = new BufferedReader(new FileReader(file));
                        StringBuilder jsonContent = new StringBuilder();
                        String line1;
                        while ((line1 = reader1.readLine()) != null) {
                            jsonContent.append(line1);
                        }
                        reader1.close();
                        configJson = new JSONObject(jsonContent.toString());
                    } else {
                        configJson = new JSONObject();
                    }

                    // 4️⃣ Atualiza o campo "blocked_apps"
                    configJson.put("blocked_apps", blockedApps);

                    // 5️⃣ Escreve de volta no arquivo
                    FileWriter writer = new FileWriter(file);
                    writer.write(configJson.toString()); // Formata com indentação
                    writer.close();

                    System.out.println("✅ Configuração atualizada com sucesso!");
                } else {
                    System.out.println("❌ Erro ao acessar a API: "+responseCode);
                }
            } catch (Exception e) {
                e.printStackTrace();
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
