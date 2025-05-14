package com.blocked;

import android.Manifest;
import android.app.AppOpsManager;
import android.app.admin.DevicePolicyManager;
import android.app.usage.UsageStatsManager;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.location.LocationManager;
import android.net.Uri;
import android.net.VpnService;
import android.os.Bundle;
import android.os.Build;
import android.os.Environment;
import android.os.PowerManager;
import android.provider.Settings;
import android.widget.TextView;
import android.widget.Toast;
import android.text.TextWatcher;
import android.text.Editable;
import android.text.InputFilter;
import android.text.InputType;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;


import android.content.ComponentName;
import android.view.View;
import android.view.KeyEvent;
import android.widget.Button;
import android.widget.EditText;
import org.json.JSONObject;
import java.io.File;
import java.io.FileWriter;

import org.json.JSONObject;
import org.json.JSONArray;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class MainActivity extends AppCompatActivity {

    private static final int LOCATION_PERMISSION_REQUEST_CODE = 456;
    private static final int USAGE_STATS_REQUEST_CODE = 123;
    private static final int STORAGE_PERMISSION_REQUEST_CODE = 1;
    private static final int REQUEST_CODE_MANAGE_STORAGE = 1234;
    private TextView tvCoordinates;
    private EditText token1;
    private EditText token2;
    private EditText token3;
    private EditText token4;
    private EditText token5;
    private EditText token6;
    private EditText token7;
    private EditText token8;
    private EditText name;
    private EditText date;
    private Button btnSave;
    private BroadcastReceiver locationReceiver;
    private ComponentName adminComponent;
    

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //token = findViewById(R.id.token);
        name = findViewById(R.id.name);
        date = findViewById(R.id.date);
        //editText4 = findViewById(R.id.editText4);
        btnSave = findViewById(R.id.buttonSave);
        token1 = findViewById(R.id.token1);
        token2 = findViewById(R.id.token2);
        token3 = findViewById(R.id.token3);
        token4 = findViewById(R.id.token4);
        token5 = findViewById(R.id.token5);
        token6 = findViewById(R.id.token6);
        token7 = findViewById(R.id.token7);
        token8 = findViewById(R.id.token8);

        EditText[] editTexts = new EditText[8];
        editTexts[0] = token1;
        editTexts[1] = token2;
        editTexts[2] = token3;
        editTexts[3] = token4;
        editTexts[4] = token5;
        editTexts[5] = token6;
        editTexts[6] = token7;
        editTexts[7] = token8;

        for(int i = 0; i < editTexts.length; i++){
            final int index = i;

            editTexts[i].setFilters(new InputFilter[] {
                new InputFilter.LengthFilter(1)
            });

            editTexts[i].addTextChangedListener(new TextWatcher(){
                @Override
                public void beforeTextChanged(CharSequence s, int start, int count, int after){}

                @Override
                public void onTextChanged(CharSequence s, int start, int before, int count){
                    if(s.length() == 1 && index < editTexts.length - 1){
                        editTexts[index + 1].requestFocus();
                    } else if(s.length() == 0 && index > 0){
                        editTexts[index - 1].requestFocus();
                    }
                }

                @Override
                public void afterTextChanged(Editable s){}
            });

            editTexts[i].setOnKeyListener((v, keyCode, event) -> {
                if(event.getAction() == KeyEvent.ACTION_DOWN && keyCode == KeyEvent.KEYCODE_DEL){
                    if(editTexts[index].getText().toString().isEmpty() && index > 0){
                        editTexts[index - 1].requestFocus();
                        editTexts[index - 1].setSelection(editTexts[index - 1].getText().length());
                    }
                }

                return false;
            });

            editTexts[i].setInputType(InputType.TYPE_TEXT_FLAG_CAP_CHARACTERS);
        }

        adminComponent = new ComponentName(this, MyDeviceAdminReceiver.class);
        btnSave.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                saveConfig();
                //hideApp();
                /*Intent stopIntent = new Intent(MainActivity.this, InternetBlockerService.class);
                stopIntent.setAction("STOP_VPN");
                startService(stopIntent);*/
            }
        });

        IntentFilter filter = new IntentFilter();
        filter.addAction(Intent.ACTION_SCREEN_ON);
        filter.addAction(Intent.ACTION_USER_PRESENT); // Quando o usuário desbloqueia
        registerReceiver(new ScreenStateReceiver(), filter);

        //Functions.createAttempt("cam", "cam");
        //System.out.println(Functions.isException(this));
        //tvCoordinates = findViewById(R.id.tvCoordinates);

        /*if (!Settings.canDrawOverlays(this)) {
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
        }*/

        //registerLocationReceiver();
    }

    private void saveConfig() {
        if(
            token1.getText().toString().equals("") || 
            token2.getText().toString().equals("") || 
            token3.getText().toString().equals("") || 
            token4.getText().toString().equals("") || 
            token5.getText().toString().equals("") || 
            token6.getText().toString().equals("") || 
            token7.getText().toString().equals("") || 
            token8.getText().toString().equals("") || 
            name.getText().toString().equals("") || 
            date.getText().toString().equals("")){
            Toast.makeText(this, "Preencha todos os campos", Toast.LENGTH_SHORT).show();
            return;
        }

        Toast.makeText(this, "Buscando dados do servidor", Toast.LENGTH_SHORT).show();
        
        String tokenComplete = 
        token1.getText().toString() +
        token2.getText().toString() +
        token3.getText().toString() +
        token4.getText().toString() +
        token5.getText().toString() +
        token6.getText().toString() +
        token7.getText().toString() +
        token8.getText().toString();

        String androidId = Settings.Secure.getString(MainActivity.this.getContentResolver(), Settings.Secure.ANDROID_ID);
        String model = Build.MODEL;

        File configFile = new File("/storage/emulated/0/Documents/blocked_config.json");
        File appsFile = new File("/storage/emulated/0/Documents/blocked_apps.txt");
        File sitesFile = new File("/storage/emulated/0/Documents/blocked_sites.txt");
        File exceptionsFile = new File("/storage/emulated/0/Documents/blocked_exceptions.txt");

        new Thread(() ->{
            HttpURLConnection connection = null;
            try {
                URL url = new URL("http://192.168.235.150:3000/api/app"); //mudar em produção
                connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("POST");
                connection.setRequestProperty("Accept", "application/json");
                connection.setRequestProperty("Content-Type", "application/json");
                connection.setConnectTimeout(5000);
                connection.setReadTimeout(5000);
                connection.setDoOutput(true); // Necessário para enviar dados

                // Corpo da requisição (JSON neste caso)
                JSONObject jsonInput = new JSONObject();
                jsonInput.put("name", name.getText().toString());
                jsonInput.put("birthday", date.getText().toString());
                jsonInput.put("code", tokenComplete);
                jsonInput.put("UID", androidId);
                jsonInput.put("model", model);

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


                    if(responseJson.getString("success").equals("true")){
                    JSONObject configContent = new JSONObject();
                    configContent.put("token", responseJson.getString("token"));
                    configContent.put("aluno", name.getText().toString());
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

                    System.out.println(exceptionsContent.toString());

                    runOnUiThread(new Runnable(){
                        public void run(){
                            Toast.makeText(MainActivity.this, "Configurado com sucesso", Toast.LENGTH_SHORT).show();
                        }
                    });

                    startService(new Intent(MainActivity.this, LocationService.class));
                    startService(new Intent(MainActivity.this, ApiService.class));
                    hideApp();
                    } else {
                        runOnUiThread(new Runnable(){
                        public void run(){
                            Toast.makeText(MainActivity.this, "Token inválido ou expirado", Toast.LENGTH_SHORT).show();
                        }
                    });
                    }
                }
            } catch (Exception e) {
                runOnUiThread(new Runnable(){
                    public void run(){
                        Toast.makeText(MainActivity.this, "Erro ao buscar dados. Tente novamente mais tarde: "+e.getMessage(), Toast.LENGTH_LONG).show();
                    }
                });
                e.printStackTrace();
            } finally {
                if (connection != null) {
                    connection.disconnect();
                }
            }
        }).start();
        }

    private void hideApp() {
        PackageManager pm = getPackageManager();
        ComponentName componentName = new ComponentName(this, MainActivity.class);

        // Oculta o ícone do app na lista de apps
        pm.setComponentEnabledSetting(componentName,
                PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                PackageManager.DONT_KILL_APP);

        //Toast.makeText(this, "App oculto", Toast.LENGTH_SHORT).show();
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

    /*@Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == LOCATION_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                startServices();
            } else {
                Toast.makeText(this, "Permissão de localização negada! O app não funcionará corretamente.", Toast.LENGTH_SHORT).show();
            }
        }
    }*/

    /*private void registerLocationReceiver() {
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
    }*/
/*
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
    }*/

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
        else if(!isDeviceAdminActive()){
            requestDeviceAdminPermission();
        }
        else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M &&
         !((PowerManager) getSystemService(Context.POWER_SERVICE))
             .isIgnoringBatteryOptimizations(getPackageName())) {
            Intent intent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
            intent.setData(Uri.parse("package:" + getPackageName()));
            startActivity(intent);
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
    File configFile = new File("/storage/emulated/0/Documents/blocked_config.json");

    // Verificar se o GPS está ativado
    LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
    if (!locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
        Toast.makeText(this, "Ative o GPS para continuar", Toast.LENGTH_SHORT).show();
        Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
        startActivity(intent);
    } 
    else if(configFile.exists()){
        startService(new Intent(this, LocationService.class));
        startService(new Intent(this, ApiService.class));
    }
    else {
        //startService(new Intent(this, AppMonitorService.class));
        //startService(new Intent(this, LocationService.class));
        //startService(new Intent(this, ApiService.class));
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


    private boolean isDeviceAdminActive() {
        DevicePolicyManager dpm = (DevicePolicyManager) getSystemService(Context.DEVICE_POLICY_SERVICE);
        return dpm != null && dpm.isAdminActive(adminComponent);
    }

    private void requestDeviceAdminPermission() {
        Intent intent = new Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN);
        intent.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, adminComponent);
        intent.putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION, 
            "Ative o modo administrador para garantir o controle escolar.");
        startActivity(intent);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        //LocalBroadcastManager.getInstance(this).unregisterReceiver(locationReceiver);
    }
}