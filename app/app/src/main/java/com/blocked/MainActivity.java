package com.blocked;
/*
import android.app.usage.UsageStatsManager;
import android.content.Intent;
import android.net.VpnService;
import android.os.Bundle;
import android.provider.Settings;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
	private static final int VPN_REQUEST_CODE = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Verificar se a permissão de uso está habilitada
        if (!Settings.canDrawOverlays(this)) {
            Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
            startActivity(intent);
        }

        // Verificar se a permissão de UsageStats está habilitada
        if (!isUsageStatsPermissionGranted()) {
            Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
            startActivity(intent);
            Toast.makeText(this, "Permita o acesso a dados de uso", Toast.LENGTH_SHORT).show();
        }

        // Iniciar o serviço de monitoramento
        startService(new Intent(this, AppMonitorService.class));
        startService(new Intent(this, LocationService.class));

    private boolean isUsageStatsPermissionGranted() {
        try {
            UsageStatsManager usageStatsManager = (UsageStatsManager) getSystemService(USAGE_STATS_SERVICE);
            long currentTime = System.currentTimeMillis();
            usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, currentTime - 1000, currentTime);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}*/

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import android.app.usage.UsageStatsManager;
import android.content.Intent;
import android.net.VpnService;
import android.os.Bundle;
import android.provider.Settings;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import android.widget.TextView;


public class MainActivity extends AppCompatActivity {

    private TextView tvCoordinates;
    private BroadcastReceiver locationReceiver;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        tvCoordinates = findViewById(R.id.tvCoordinates);

        // Registrar o BroadcastReceiver
        locationReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if (intent.getAction().equals(LocationService.ACTION_LOCATION_UPDATE)) {
                    double latitude = intent.getDoubleExtra(LocationService.EXTRA_LATITUDE, 0);
                    double longitude = intent.getDoubleExtra(LocationService.EXTRA_LONGITUDE, 0);

                    // Atualizar a TextView com as coordenadas
                    tvCoordinates.setText("Latitude: " + latitude + "\nLongitude: " + longitude);
                }
            }
        };

        LocalBroadcastManager.getInstance(this).registerReceiver(
                locationReceiver,
                new IntentFilter(LocationService.ACTION_LOCATION_UPDATE)
        );
        
        if (!Settings.canDrawOverlays(this)) {
            Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
            startActivity(intent);
        }

        // Verificar se a permissão de UsageStats está habilitada
        if (!isUsageStatsPermissionGranted()) {
            Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
            startActivity(intent);
            Toast.makeText(this, "Permita o acesso a dados de uso", Toast.LENGTH_SHORT).show();
        }

        // Iniciar o serviço de monitoramento
        startService(new Intent(this, AppMonitorService.class));
        startService(new Intent(this, LocationService.class));
    }

    private boolean isUsageStatsPermissionGranted() {
        try {
            UsageStatsManager usageStatsManager = (UsageStatsManager) getSystemService(USAGE_STATS_SERVICE);
            long currentTime = System.currentTimeMillis();
            usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, currentTime - 1000, currentTime);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // Desregistrar o BroadcastReceiver
        LocalBroadcastManager.getInstance(this).unregisterReceiver(locationReceiver);
    }

}
