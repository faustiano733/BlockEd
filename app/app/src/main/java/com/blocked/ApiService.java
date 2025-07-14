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

import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.net.Uri;

import androidx.annotation.Nullable;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.Executors;

import java.io.File;
import java.io.FileReader;
import java.io.BufferedReader;
import java.io.FileWriter;

import org.json.JSONObject;
import org.json.JSONArray;

import android.Manifest;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.os.Bundle;
import android.os.Looper;
import androidx.core.app.NotificationCompat;
import androidx.core.app.ActivityCompat;
import android.content.BroadcastReceiver;
import android.net.Uri;

import android.app.job.JobInfo;
import android.app.job.JobScheduler;
import android.content.ComponentName;
import android.os.SystemClock;

import android.content.IntentFilter;
import android.content.pm.PackageManager;
import androidx.core.app.ActivityCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

public class ApiService extends Service {
    private static final String TAG = "ApiService";
    //private static String API_URL = "http://172.20.10.5:3000/api/app";
    private static final int INTERVAL_MS = 5000; 

    private final Handler handler = new Handler();
    private Runnable apiRequestRunnable;
    private boolean delete = false;
    private boolean deleteResponse = false;

    @Override
    public void onCreate() {
        super.onCreate();
        startForegroundService();
        startPeriodicRequests();

        Intent intent = new Intent(this, WatchdogReceiver.class);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(
            this,
            11111,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        AlarmManager alarmManager = (AlarmManager) getSystemService(ALARM_SERVICE);
        long firstTriggerTime = SystemClock.elapsedRealtime() + 5000; // 5 segundos de atraso inicial
        long interval = 15000; // intervalo de 15 segundos entre cada verificação
        alarmManager.setRepeating(
            AlarmManager.ELAPSED_REALTIME_WAKEUP,
            firstTriggerTime,
            interval,
            pendingIntent
        );
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
                .setGroup("blocked_group")
                .build();

        Notification summaryNotification = new Notification.Builder(this, channelId)
        .setContentTitle("API Service")
        .setContentText("Várias atualizações disponíveis")
        .setSmallIcon(R.drawable.ic_launcher_foreground)
        .setStyle(new Notification.InboxStyle()
            .addLine("Atualização 1")
            .addLine("Atualização 2")
            .setSummaryText("2 novas atualizações"))
        .setGroup("blocked_group")
        .setGroupSummary(true)
        .build();

        notificationManager.notify(11111, summaryNotification);

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
            HttpURLConnection deleteConnection = null;
            try {
                File configFile = new File("/storage/emulated/0/Documents/blocked_config.json");
                File appsFile = new File("/storage/emulated/0/Documents/blocked_apps.txt");
                File sitesFile = new File("/storage/emulated/0/Documents/blocked_sites.txt");
                File exceptionsFile = new File("/storage/emulated/0/Documents/blocked_exceptions.txt");
                File attemptsFile = new File("/storage/emulated/0/Documents/blocked_attempts.json");

                JSONObject configContent = new JSONObject();
                JSONArray attempsArray = new JSONArray();

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
                    } else {
                        return;
                    }

                if(attemptsFile.exists()){
                    StringBuilder attemptsBuilder = new StringBuilder();
                    JSONObject attemptsContent = new JSONObject();

                        try (BufferedReader attemptsReader = new BufferedReader(new FileReader(attemptsFile))) {
                            String attemptsLine;

                            while ((attemptsLine = attemptsReader.readLine()) != null) {
                                attemptsBuilder.append(attemptsLine);
                                //blockedApps.add(line.trim());
                            }
                        } catch (Exception e) {

                        }

                        attemptsContent = new JSONObject(attemptsBuilder.toString());
                        attempsArray = attemptsContent.getJSONArray("attempts");
                }
                
                //HttpURLConnection connection = null;
            
                URL url = new URL("https://blockedvercel.vercel.app/api/app"); //mudar em produção
                connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("PUT");
                connection.setRequestProperty("Accept", "application/json");
                connection.setRequestProperty("Content-Type", "application/json");
                connection.setConnectTimeout(10000);
                connection.setReadTimeout(10000);
                connection.setDoOutput(true); // Necessário para enviar dados

                // Corpo da requisição (JSON neste caso)
                JSONObject jsonInput = new JSONObject();
                jsonInput.put("token", configContent.getString("token"));
                jsonInput.put("attempts", attempsArray);
                

                String jsonInputString = jsonInput.toString();

                // Enviar os dados
                try (OutputStream os = connection.getOutputStream()) {
                    byte[] input = jsonInputString.getBytes("utf-8");
                    os.write(input, 0, input.length);
                }

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
                    if(!(responseJson.getString("success").equals("true"))){
                        return;
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

                    /*if(responseJson.getString("uninstall").equals("true")){
                        delete = true;
                    }*/

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
                    if(attemptsFile.exists()){
                        JSONObject tmp_attempts = new JSONObject();
                        JSONArray tmp_array = new JSONArray();

                        tmp_attempts.put("attempts", tmp_array);

                        FileWriter attemptsWriter = new FileWriter(attemptsFile);
                        attemptsWriter.write(tmp_attempts.toString(2));
                        attemptsWriter.close();
                    }
                }
            
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                if (connection != null) {
                    connection.disconnect();
                }
            }

            /*
            if(delete){
                try {
                File configFile = new File("/storage/emulated/0/Documents/blocked_config.json");
                File appsFile = new File("/storage/emulated/0/Documents/blocked_apps.txt");
                File sitesFile = new File("/storage/emulated/0/Documents/blocked_sites.txt");
                File exceptionsFile = new File("/storage/emulated/0/Documents/blocked_exceptions.txt");
                File attemptsFile = new File("/storage/emulated/0/Documents/blocked_attempts.json");

                JSONObject configContent = new JSONObject();
                JSONArray attempsArray = new JSONArray();

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
                    } else {
                        return;
                    }
                
                //HttpURLConnection connection = null;
            
                URL url = new URL("https://blockedvercel.vercel.app/api/app"); //mudar em produção
                deleteConnection = (HttpURLConnection) url.openConnection();
                deleteConnection.setRequestMethod("DELETE");
                deleteConnection.setRequestProperty("Accept", "application/json");
                deleteConnection.setRequestProperty("Content-Type", "application/json");
                deleteConnection.setConnectTimeout(10000);
                deleteConnection.setReadTimeout(10000);
                deleteConnection.setDoOutput(true); // Necessário para enviar dados

                // Corpo da requisição (JSON neste caso)
                JSONObject jsonInput = new JSONObject();
                jsonInput.put("token", configContent.getString("token"));
                //jsonInput.put("attempts", attempsArray);
                

                String jsonInputString = jsonInput.toString();

                // Enviar os dados
                try (OutputStream os = deleteConnection.getOutputStream()) {
                    byte[] input = jsonInputString.getBytes("utf-8");
                    os.write(input, 0, input.length);
                }

                int responseCode = deleteConnection.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                   if (delete) {
    Context context = getApplicationContext();
    ComponentName adminComponent = new ComponentName(context, MyDeviceAdminReceiver.class);
    DevicePolicyManager dpm = (DevicePolicyManager) context.getSystemService(Context.DEVICE_POLICY_SERVICE);

    // Revoga o Device Admin, se estiver ativo
    if (dpm.isAdminActive(adminComponent)) {
        dpm.removeActiveAdmin(adminComponent);
    }

    // Aguarda um pouco para garantir que o Device Admin foi removido
    try {
        Thread.sleep(1000); // 1 segundo
    } catch (InterruptedException e) {
        e.printStackTrace();
    }

    // Cria a Intent de desinstalação
    Intent uninstallIntent = new Intent(Intent.ACTION_DELETE);
    uninstallIntent.setData(Uri.parse("package:" + context.getPackageName()));
    uninstallIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK); // ESSENCIAL fora da UI thread

    // Inicia a atividade de desinstalação
    context.startActivity(uninstallIntent);
}

                }
            
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                if (deleteConnection != null) {
                    deleteConnection.disconnect();
                }
            }
            }*/




        });
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return START_STICKY;
    }

    
    @Override
    public void onTaskRemoved(Intent rootIntent) {
        //scheduleServiceRestart(); // Agenda reinício via AlarmManager + JobScheduler
        super.onTaskRemoved(rootIntent);
    }

    /*private void scheduleServiceRestart() {
        // Reinicia via AlarmManager (rápido)
        Intent restartIntent = new Intent(this, WatchdogReceiver.class);
        PendingIntent pendingIntent = PendingIntent.getService(
            this, 
            2, 
            restartIntent, 
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        AlarmManager alarmManager = (AlarmManager) getSystemService(ALARM_SERVICE);
        if (alarmManager != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                alarmManager.setExactAndAllowWhileIdle(
                    AlarmManager.ELAPSED_REALTIME_WAKEUP,
                    SystemClock.elapsedRealtime() + 3000, // 1 segundo
                    pendingIntent
                );
            } else {
                alarmManager.setExact(
                    AlarmManager.ELAPSED_REALTIME_WAKEUP,
                    SystemClock.elapsedRealtime() + 3000,
                    pendingIntent
                );
            }
        }
    }
    */

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
