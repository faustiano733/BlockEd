package com.blocked;

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
import android.net.VpnService;
import android.os.Bundle;
import android.os.Build;
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


import android.content.ComponentName;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import org.json.JSONObject;
import java.io.File;
import java.io.FileWriter;

import org.json.JSONObject;
import org.json.JSONArray;

public class MainActivity extends AppCompatActivity {

    private static final int LOCATION_PERMISSION_REQUEST_CODE = 456;
    private static final int USAGE_STATS_REQUEST_CODE = 123;
    private static final int STORAGE_PERMISSION_REQUEST_CODE = 1;
    private static final int REQUEST_CODE_MANAGE_STORAGE = 1234;
    private TextView tvCoordinates;
    private EditText token;
    private EditText name;
    private EditText date;
    private Button btnSave;
    private BroadcastReceiver locationReceiver;
    

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        token = findViewById(R.id.token);
        name = findViewById(R.id.name);
        date = findViewById(R.id.date);
        //editText4 = findViewById(R.id.editText4);
        btnSave = findViewById(R.id.buttonSave);

        btnSave.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //saveConfig();
                //hideApp();
                /*Intent stopIntent = new Intent(MainActivity.this, InternetBlockerService.class);
                stopIntent.setAction("STOP_VPN");
                startService(stopIntent);*/
            }
        });

        //Functions.createAttempt("cam", "cam");
        System.out.println(Functions.isException(this));
        tvCoordinates = findViewById(R.id.tvCoordinates);

        if (!Settings.canDrawOverlays(this)) {
            Intent overlayIntent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
            startActivity(overlayIntent);
        }

        else if (!Environment.isExternalStorageManager()) {
            Intent intent = new Intent(Settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION);
            //Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
            startActivityForResult(intent, REQUEST_CODE_MANAGE_STORAGE);
        }

        else if (!isUsageStatsPermissionGranted()) {
            Intent usageStatsIntent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
            startActivityForResult(usageStatsIntent, USAGE_STATS_REQUEST_CODE);
            Toast.makeText(this, "Ative o acesso a dados de uso para o app", Toast.LENGTH_LONG).show();
        }
        else if(VpnService.prepare(this) != null){
            Intent VpnIntent = VpnService.prepare(this);
            startActivityForResult(VpnIntent, 100);
        }
        else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(
                this, 
                new String[]{Manifest.permission.POST_NOTIFICATIONS}, 101);
            }
            checkLocationPermissions();
        } else {
            checkLocationPermissions(); // Verificar permissões de localização
        }

        registerLocationReceiver();
    }

    private void saveConfig() {
        if(token.getText().toString().equals("") || name.getText().toString().equals("") || date.getText().toString().equals("")){
            Toast.makeText(this, "Preencha todos os campos", Toast.LENGTH_SHORT).show();
        }
        else{
            try {
                // Criando um JSON com os valores das EditText
                JSONObject config = new JSONObject();
                JSONArray jarray = new JSONArray();

                String[] blockedApps = {"com.facebook.lite", "com.whatsapp", "com.nada", "com.whatsapp.mobile"};
                for(String app : blockedApps){
                    jarray.put(app);
                }
                
                config.put("nomeDoAluno", name.getText().toString());
                config.put("data", date.getText().toString());
                config.put("token", token.getText().toString());
                config.put("blocked_apps", jarray);

                File documentsDir = new File(Environment.getExternalStorageDirectory(), "Documents");
                //    if (!documentsDir.exists()) {
                //    documentsDir.mkdirs();  // Criar se não existir
                //}

                // Criando o arquivo no diretório
                File configFile = new File(documentsDir, "blocked_config.json");
                FileWriter writer = new FileWriter(configFile);
                writer.write(config.toString());
                writer.flush();
                writer.close();

                //Toast.makeText(this, "Configuração salva em " + configFile.getAbsolutePath(), Toast.LENGTH_LONG).show();

                //hideApp();
                finish();
            } catch (Exception e) {
                e.printStackTrace();
                Toast.makeText(this, "Erro ao salvar", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void hideApp() {
        PackageManager pm = getPackageManager();
        ComponentName componentName = new ComponentName(this, MainActivity.class);

        // Oculta o ícone do app na lista de apps
        pm.setComponentEnabledSetting(componentName,
                PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                PackageManager.DONT_KILL_APP);

        Toast.makeText(this, "App oculto", Toast.LENGTH_SHORT).show();
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
        else if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_BACKGROUND_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(
                this, 
                new String[]{Manifest.permission.ACCESS_BACKGROUND_LOCATION}, 
                LOCATION_PERMISSION_REQUEST_CODE
            );
        }
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
        // if (isUsageStatsPermissionGranted()) {
        //     startServices();
        // } else {
        //     Toast.makeText(this, "Permissão de dados de uso ainda não concedida!", Toast.LENGTH_SHORT).show();
        // }

        if (!Settings.canDrawOverlays(this)) {
            Intent overlayIntent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
            startActivity(overlayIntent);
        }

        else if (!Environment.isExternalStorageManager()) {
            Intent intent = new Intent(Settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION);
            //Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
            startActivityForResult(intent, REQUEST_CODE_MANAGE_STORAGE);
        }

        else if (!isUsageStatsPermissionGranted()) {
            Intent usageStatsIntent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
            startActivityForResult(usageStatsIntent, USAGE_STATS_REQUEST_CODE);
            Toast.makeText(this, "Ative o acesso a dados de uso para o app", Toast.LENGTH_LONG).show();
        }
        else if(VpnService.prepare(this) != null){
            Intent VpnIntent = VpnService.prepare(this);
            startActivityForResult(VpnIntent, 100);
        }

        else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(
                this, 
                new String[]{Manifest.permission.POST_NOTIFICATIONS}, 101);
            }
            checkLocationPermissions();
        } else {
            checkLocationPermissions(); // Verificar permissões de localização
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
        //startService(new Intent(this, HttpProxyService.class));
        //startService(new Intent(this, InternetBlockerService.class));
        //startService(new Intent(this, SiteBlockerService.class));
        //startService(new Intent(this, DnsFilterService.class));
        //startService(new Intent(this, DnsVpnService.class));
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