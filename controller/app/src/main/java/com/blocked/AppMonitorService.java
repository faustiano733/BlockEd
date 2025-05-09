package com.blocked;

import android.app.NotificationManager;
import android.app.NotificationChannel;
import android.app.Notification;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.Environment;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;

import org.json.JSONObject;
import org.json.JSONArray;

import java.io.File;
import java.io.FileReader;
import java.io.BufferedReader;
import java.util.ArrayList;
import java.util.List;
import java.util.HashSet;
import java.util.Set;
import java.util.SortedMap;
import java.util.TreeMap;

public class AppMonitorService extends Service {
	
	private static final String TAG = "AppMonitorService";
	private static final String FILE_PATH = "/storage/emulated/0/Documents/blocked_apps.txt";
	private WindowManager windowManager;
	private View overlayView;
	private Handler handler = new Handler();
	private Handler updateHandler = new Handler();
	//private Set blockedApps;
	private Set<String> blockedApps = new HashSet<>();
	private boolean isOverlayVisible = false;
	
	@Override
	public void onCreate() {
		super.onCreate();
		startForegroundService();
		//blockedApps = loadBlockedAppsFromExternalStorage();
		loadBlockedAppsFromExternalStorage();
		windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
		startMonitoring();
	}
	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
    	startMonitoring();
    	startUpdatingBlockedApps();
    	return START_STICKY; // Garante que o serviço seja reiniciado automaticamente
	}

	private void startForegroundService() {
    NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

    String channelId = "AppBlockerServiceChannel";
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        NotificationChannel channel = new NotificationChannel(
                channelId,
                "App Blocker Service",
                NotificationManager.IMPORTANCE_LOW
        );
        notificationManager.createNotificationChannel(channel);
    }

    Notification notification = new Notification.Builder(this, channelId)
            .setContentTitle("App Blocker em execução")
            .setContentText("Monitorando aplicativos")
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .build();

    startForeground(1, notification);
	}

	
	private Runnable monitorRunnable = new Runnable() {
    @Override
    public void run() {
        String currentApp = getForegroundApp();
        Log.d(TAG, "Current App: " + currentApp);

        if (isAppBlocked(currentApp)) {
            showOverlay();
        } else {
            removeOverlay();
        }

        // Reexecutar o monitoramento
        handler.postDelayed(this, 500);
    }
	};

	private Runnable updateBlockedAppsRunnable = new Runnable() {
        @Override
        public void run() {
            //blockedApps = loadBlockedAppsFromExternalStorage();
            loadBlockedAppsFromExternalStorage();
            Log.d(TAG, "Lista de apps bloqueados atualizada!");
            
            // Reexecutar a cada 5 segundos
            updateHandler.postDelayed(this, 5000);
        }
    };

	private void startMonitoring() {
    	handler.removeCallbacks(monitorRunnable);
    	handler.post(monitorRunnable);
	}

	private void startUpdatingBlockedApps() {
        updateHandler.removeCallbacks(updateBlockedAppsRunnable);
        updateHandler.post(updateBlockedAppsRunnable);
    }


	
	private String getForegroundApp() {
		UsageStatsManager usageStatsManager = (UsageStatsManager) getSystemService(Context.USAGE_STATS_SERVICE);
		long endTime = System.currentTimeMillis();
		long startTime = endTime - 1000 * 60; // Último minuto
		
		List<UsageStats> usageStats = usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime, endTime);
		
		if (usageStats != null) {
			SortedMap<Long, UsageStats> sortedMap = new TreeMap<>();
			for (UsageStats stats : usageStats) {
				sortedMap.put(stats.getLastTimeUsed(), stats);
			}
			
			if (!sortedMap.isEmpty()) {
				return sortedMap.get(sortedMap.lastKey()).getPackageName();
			}
		}
		return null;
	}
	
	private boolean isAppBlocked(String packageName) {
		//for (String blockedApp : blockedApps) {
		//	if (blockedApp.equals(packageName)) {
		//		return true;
		//	}
		//}
		if(blockedApps.contains(packageName)){
			return true;
		}

		return false;
	}
	
	private void showOverlay() {
    if (overlayView == null && !isOverlayVisible) {
        overlayView = LayoutInflater.from(getApplicationContext()).inflate(R.layout.activity_block_screen, null);

        WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.MATCH_PARENT,
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.O ?
                        WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY :
                        WindowManager.LayoutParams.TYPE_PHONE,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE |
                        WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL |
                        WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON,
                PixelFormat.TRANSLUCENT
        );

        windowManager.addView(overlayView, params);
        isOverlayVisible = true;

        Functions.createAttempt("app", getForegroundApp());
        overlayView.setOnTouchListener((v, event) -> true); // Ignorar interações
    }
	}

	
	private void removeOverlay() {
    if (overlayView != null && isOverlayVisible) {
        try {
            windowManager.removeView(overlayView);
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
        }
        overlayView = null;
        isOverlayVisible = false;
    }
	}

	private void loadBlockedAppsFromExternalStorage() {
    //File documentsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOCUMENTS);
	//File documentsDir = new File(Environment.getExternalStorageDirectory(), "Documents");
	blockedApps.clear();
    File file = new File(FILE_PATH);

    if (!file.exists()) {
        Log.e(TAG, "Arquivo blocked_apps.txt não encontrado!");
        //return new String[0];
    }

    //StringBuilder jsonString = new StringBuilder();
    try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
        String line;
        while ((line = reader.readLine()) != null) {
            //jsonString.append(line);
            blockedApps.add(line.trim());
        }

        //JSONObject jsonObject = new JSONObject(jsonString.toString());
        //JSONArray blockedAppsArray = jsonObject.getJSONArray("blocked_apps");

        //String[] blockedApps = new String[blockedAppsArray.length()];
        //for (int i = 0; i < blockedAppsArray.length(); i++) {
        //    blockedApps[i] = blockedAppsArray.getString(i);
        //}

        //return blockedApps;
    } catch (Exception e) {
        Log.e(TAG, "Erro ao ler o arquivo blocked_apps.txt: " + e.getMessage());
        //return new String[0];
    }
	}

	
	@Override
	public IBinder onBind(Intent intent) {
		return null;
	}
	
	@Override
	public void onDestroy() {
		super.onDestroy();
		handler.removeCallbacksAndMessages(null);
		updateHandler.removeCallbacksAndMessages(null);
		removeOverlay();
	}
}