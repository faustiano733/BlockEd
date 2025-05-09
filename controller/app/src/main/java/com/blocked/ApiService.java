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
    //private static String API_URL = "http://172.20.10.5:3000/api/app";
    private static final int INTERVAL_MS = 5000; 

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
                .setSmallIcon(R.drawable.ic_launcher_foreground)
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
                File configFile = new File("/storage/emulated/0/Documents/blocked_config.json");
                File appsFile = new File("/storage/emulated/0/Documents/blocked_apps.txt");
                File sitesFile = new File("/storage/emulated/0/Documents/blocked_sites.txt");
                File exceptionsFile = new File("/storage/emulated/0/Documents/blocked_exceptions.txt");
                
                //HttpURLConnection connection = null;
            
                URL url = new URL("http://192.168.227.150/app_data.php"); //mudar em produção
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
                    //Toast.makeText(MainActivity.this, response.toString(), Toast.LENGTH_SHORT).show();
                    JSONObject responseJson = new JSONObject(response.toString());

                    JSONObject configContent = new JSONObject();

                    if(configFile.exists()){
                        StringBuilder configBuilder = new StringBuilder();

                        try (BufferedReader configReader = new BufferedReader(new FileReader(configFile))) {
                            String configLine;

                            while ((configLine = configReader.readLine()) != null) {
                                configBuilder.append(configLine);
                                //blockedApps.add(line.trim());
                            }
                        } catch (Exception e) {

                        }

                        configContent = new JSONObject(configBuilder.toString());
                    }

                    //configContent.put("token", responseJson.getString("token"));
                    //configContent.put("aluno", name.getText().toString());
                    configContent.put("latitude", responseJson.getString("latitude"));
                    configContent.put("longitude", responseJson.getString("longitude"));
                    configContent.put("raio", responseJson.getString("raio"));
                    configContent.put("block_apps", responseJson.getString("block_apps"));
                    configContent.put("block_sites", responseJson.getString("block_sites"));
                    configContent.put("block_cam", responseJson.getString("block_cam"));
                    configContent.put("block_internet", responseJson.getString("block_internet"));

                    FileWriter configWriter = new FileWriter(configFile);
                    configWriter.write(configContent.toString(4));
                    configWriter.close();

                    //System.out.println(configContent.toString());

                    JSONArray domainsJson = responseJson.getJSONArray("domains");
                    StringBuilder domainsContent = new StringBuilder();

                    for(int i = 0; i < domainsJson.length(); i++){
                        domainsContent.append(domainsJson.getString(i)+"\n");
                    }

                    FileWriter sitesWriter = new FileWriter(sitesFile);
                    sitesWriter.write(domainsContent.toString());
                    sitesWriter.close();

                    //System.out.println(domainsContent.toString());


                    JSONArray appsJson = responseJson.getJSONArray("apps");
                    StringBuilder appsContent = new StringBuilder();

                    for(int i = 0; i < appsJson.length(); i++){
                        appsContent.append(appsJson.getString(i)+"\n");
                    }

                    FileWriter appsWriter = new FileWriter(appsFile);
                    appsWriter.write(appsContent.toString());
                    appsWriter.close();

                    //System.out.println(appsContent.toString());


                    JSONArray exceptionsJson = responseJson.getJSONArray("exceptions");
                    StringBuilder exceptionsContent = new StringBuilder();

                    for(int i = 0; i < exceptionsJson.length(); i++){
                        exceptionsContent.append(exceptionsJson.getString(i)+"\n");
                    }

                    FileWriter exceptionsWriter = new FileWriter(exceptionsFile);
                    exceptionsWriter.write(exceptionsContent.toString());
                    exceptionsWriter.close();

                    //System.out.println(exceptionsContent.toString());
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
