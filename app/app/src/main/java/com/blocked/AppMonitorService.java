package com.blocked;


import android.app.NotificationManager;
import android.app.NotificationChannel;
import android.app.Notification;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;

import java.util.List;
import java.util.SortedMap;
import java.util.TreeMap;

public class AppMonitorService extends Service {
	
	private static final String TAG = "AppMonitorService";
	private WindowManager windowManager;
	private View overlayView;
	private Handler handler = new Handler();
	private String[] blockedApps = {"com.whatsapp", "com.facebook.katana", "com.facebook.lite"};
	private boolean isOverlayVisible = false;
	
	@Override
	public void onCreate() {
		super.onCreate();
		startForegroundService();
		windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
		startMonitoring();
	}
	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
    	startMonitoring();
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

	private void startMonitoring() {
    	handler.removeCallbacks(monitorRunnable); // Garante que o Runnable anterior seja cancelado
    	handler.post(monitorRunnable);
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
		for (String blockedApp : blockedApps) {
			if (blockedApp.equals(packageName)) {
				return true;
			}
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

        overlayView.setOnTouchListener((v, event) -> true); // Ignorar interações
    }
}

	
	private void removeOverlay() {
    if (overlayView != null && isOverlayVisible) {
        try {
            windowManager.removeView(overlayView);
        } catch (IllegalArgumentException e) {
            // Evitar exceções se o overlay já foi removido
            e.printStackTrace();
        }
        overlayView = null;
        isOverlayVisible = false;
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
		removeOverlay();
	}
}