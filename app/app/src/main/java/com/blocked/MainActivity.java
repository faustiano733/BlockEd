package com.blocked;
/*
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
*/

import android.Manifest;
import android.app.AppOpsManager;
import android.app.usage.UsageStatsManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Environment;
import android.provider.Settings;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

public class MainActivity extends AppCompatActivity {

    private static final int LOCATION_PERMISSION_REQUEST_CODE = 456;
    private static final int USAGE_STATS_REQUEST_CODE = 123;
    private static final int STORAGE_PERMISSION_REQUEST_CODE = 1;
    private static final int REQUEST_CODE_MANAGE_STORAGE = 1234;
    private TextView tvCoordinates;
    private BroadcastReceiver locationReceiver;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        tvCoordinates = findViewById(R.id.tvCoordinates);

        // Verificar permissões de overlay e usage stats primeiro
        if (!Settings.canDrawOverlays(this)) {
            Intent overlayIntent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
            startActivity(overlayIntent);
        }

        if (!Environment.isExternalStorageManager()) {
            Intent intent = new Intent(Settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION);
            //Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
            startActivityForResult(intent, REQUEST_CODE_MANAGE_STORAGE);
        }

        if (!isUsageStatsPermissionGranted()) {
            Intent usageStatsIntent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
            startActivityForResult(usageStatsIntent, USAGE_STATS_REQUEST_CODE);
            Toast.makeText(this, "Ative o acesso a dados de uso para o app", Toast.LENGTH_LONG).show();
        } else {
            checkLocationPermissions(); // Verificar permissões de localização
        }

        registerLocationReceiver();
    }

    private void checkLocationPermissions() {
        // Verificar se as permissões de localização já foram concedidas
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(
                this,
                new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                LOCATION_PERMISSION_REQUEST_CODE
            );
        }/* else if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, 
                new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 
                STORAGE_PERMISSION_REQUEST_CODE
            );
        }*/
        /*else if (!Environment.isExternalStorageManager()) {
            Intent intent = new Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);
            startActivityForResult(intent, REQUEST_CODE_MANAGE_STORAGE);
        }*/
        else {
            startServices(); // Iniciar serviços se todas as permissões estiverem OK
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == LOCATION_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                startServices();
            } else {
                Toast.makeText(this, "Permissão de localização negada! O app não funcionará corretamente.", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void registerLocationReceiver() {
        locationReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if (intent.getAction().equals(LocationService.ACTION_LOCATION_UPDATE)) {
                    double latitude = intent.getDoubleExtra(LocationService.EXTRA_LATITUDE, 0);
                    double longitude = intent.getDoubleExtra(LocationService.EXTRA_LONGITUDE, 0);
                    tvCoordinates.setText("Latitude: " + latitude + "\nLongitude: " + longitude);
                }
            }
        };

        LocalBroadcastManager.getInstance(this).registerReceiver(
                locationReceiver,
                new IntentFilter(LocationService.ACTION_LOCATION_UPDATE)
        );
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        //Toast.makeText(this, "Resumido!", Toast.LENGTH_SHORT).show();

        if (requestCode == USAGE_STATS_REQUEST_CODE) {
            if (isUsageStatsPermissionGranted()) {
                startServices();
            } else {
                Toast.makeText(this, "Permissão de dados de uso ainda não concedida!", Toast.LENGTH_SHORT).show();
            }
        }
    }

     @Override
    protected void onResume() {
        super.onResume();
        //Toast.makeText(this, "Resumido!", Toast.LENGTH_SHORT).show();

        // Verificar permissão de Usage Stats ao retomar a Activity
        if (isUsageStatsPermissionGranted()) {
            startServices();
        } else {
            Toast.makeText(this, "Permissão de dados de uso ainda não concedida!", Toast.LENGTH_SHORT).show();
        }
    }

    /*private void startServices() {
        startService(new Intent(this, AppMonitorService.class));
        startService(new Intent(this, LocationService.class));
    }*/
    private void startServices() {
    // Verificar se o GPS está ativado
    LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
    if (!locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
        Toast.makeText(this, "Ative o GPS para continuar", Toast.LENGTH_SHORT).show();
        Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
        startActivity(intent);
    } else {
        //startService(new Intent(this, AppMonitorService.class));
        startService(new Intent(this, LocationService.class));
        //startService(new Intent(this, CamMonitorService.class));
    }
    }

    private boolean isUsageStatsPermissionGranted() {
        try {
            PackageManager packageManager = getPackageManager();
            ApplicationInfo applicationInfo = packageManager.getApplicationInfo(getPackageName(), 0);
            
            AppOpsManager appOpsManager = (AppOpsManager) getSystemService(Context.APP_OPS_SERVICE);
            int mode = appOpsManager.checkOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS, 
                applicationInfo.uid, 
                applicationInfo.packageName
            );
            
            return mode == AppOpsManager.MODE_ALLOWED;
        } catch (PackageManager.NameNotFoundException e) {
            return false;
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        LocalBroadcastManager.getInstance(this).unregisterReceiver(locationReceiver);
    }
}