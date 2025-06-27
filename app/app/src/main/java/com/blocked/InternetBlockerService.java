package com.blocked;

import android.net.VpnService;
import android.os.ParcelFileDescriptor;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileDescriptor;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.util.HashSet;
import java.util.Set;
import android.content.pm.PackageManager;

import java.nio.ByteBuffer;
import java.util.Arrays;
import java.util.List;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.os.Build;
import android.util.Log;
import androidx.core.app.NotificationCompat;

public class InternetBlockerService extends VpnService implements Runnable {

    private ParcelFileDescriptor vpnInterface;
    private boolean isRunning = false;
    private static final String CHANNEL_ID = "vpn_service_channel";
    private static final int NOTIFICATION_ID = 12;
    private Thread vpnThread;

    // Lista de sites bloqueados (pode ser carregada dinamicamente depois)
    private final Set<String> blockedSites = new HashSet<>();

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if(intent != null){
            //stopSelf();
            //return START_NOT_STICKY;
            String intentAction = (String) intent.getAction();

            if("STOP_VPN".equals(intentAction)){
                System.out.println("Tentando parar");
                this.onDestroy();
                this.stopForeground(true);
                
                return START_NOT_STICKY;
            }
        }

        if (isRunning) {
            Log.d("internetBlocker", "Serviço já está em execução.");
            return START_STICKY;
        }

        isRunning = true;

        startForegroundNotification();
        setupVpn();

        vpnThread = new Thread(this);
        vpnThread.start();

        return START_STICKY;
    }

    private void setupVpn() {

        if (vpnInterface != null) {
            try {
                vpnInterface.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            vpnInterface = null;
        }

        Builder builder = new Builder();
        builder.addAddress("10.0.0.2", 32); // Endereço IP virtual para a VPN
        builder.addRoute("0.0.0.0", 0); // Redireciona todo tráfego para a VPN
        builder.setBlocking(true);
         try {
            builder.addDisallowedApplication("com.blocked"); // App que será excluído da VPN
        } catch (PackageManager.NameNotFoundException e) {
            
        }
        // Garante que o tráfego seja processado corretamente
        vpnInterface = builder.establish();
    }

    @Override
public void run() {
    try {
        FileDescriptor fd = vpnInterface.getFileDescriptor();
        FileInputStream inputStream = new FileInputStream(fd);
        FileOutputStream outputStream = new FileOutputStream(fd);
        
        ByteBuffer buffer = ByteBuffer.allocate(32767); // Tamanho máximo de um pacote UDP/IP
        
        while (!Thread.interrupted()) {
            buffer.clear();
            
            // Lendo os pacotes do tun
            int length = inputStream.read(buffer.array()); 
            if (length > 0) {
                buffer.limit(length);
                
                // 🔍 Verifica se conseguimos extrair um domínio
                String extractedDomain = extractDomainFromPacket(buffer);
                System.out.println("🔍 Domínio DNS identificado: " + extractedDomain);

                if (extractedDomain != null && blockedSites.contains(extractedDomain)) {
                    System.out.println("❌ BLOQUEADO: " + extractedDomain);
                    continue; // Bloqueia o pacote sem enviá-lo de volta
                }

                // 🔄 Se o domínio não for bloqueado, o pacote é repassado
                outputStream.write(buffer.array(), 0, length);
            }
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
}


    private String extractDomainFromPacket(ByteBuffer buffer) {
    try {
        buffer.position(0); // Reinicia o buffer na posição 0

        // Lendo os primeiros bytes do cabeçalho IP
        byte firstByte = buffer.get();
        int ipVersion = (firstByte >> 4) & 0xF; // Extrai a versão do IP

        if (ipVersion != 4) {
            return null; // Apenas IPV4 por enquanto
        }

        // O cabeçalho IPv4 tem no mínimo 20 bytes
        buffer.position(9);
        byte protocol = buffer.get(); // Protocolo: 6 = TCP, 17 = UDP

        if (protocol != 17) {
            return null; // Apenas pacotes UDP
        }

        buffer.position(20); // Cabeçalho IP tem 20 bytes

        // Pegando as portas
        int sourcePort = (buffer.getShort() & 0xFFFF);
        int destinationPort = (buffer.getShort() & 0xFFFF);

        if (destinationPort != 53 && sourcePort != 53) {
            return null; // Apenas tráfego DNS
        }

        // Cabeçalho UDP tem 8 bytes, então pulamos para o payload DNS
        buffer.position(28);

        buffer.getShort(); // Transaction ID (2 bytes)
        buffer.getShort(); // Flags (2 bytes)
        int questions = buffer.getShort() & 0xFFFF; // Número de queries

        if (questions == 0) {
            return null;
        }

        // Extraindo o nome do domínio da query DNS
        StringBuilder domain = new StringBuilder();
        while (true) {
            int length = buffer.get() & 0xFF; // Tamanho da próxima parte do domínio

            if (length == 0) {
                break; // Fim do nome do domínio
            }

            byte[] domainPart = new byte[length];
            buffer.get(domainPart);
            domain.append(new String(domainPart)).append(".");
        }

        return domain.length() > 1 ? domain.substring(0, domain.length() - 1) : null;
    } catch (Exception e) {
        e.printStackTrace();
        return null;
    }
    }





    private void startForegroundNotification() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "VPN Service",
                NotificationManager.IMPORTANCE_LOW
        );
        NotificationManager manager = getSystemService(NotificationManager.class);
        if (manager != null) {
            manager.createNotificationChannel(channel);
        }
    }

    Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("VPN Ativada")
            .setContentText("Monitorando tráfego de internet.")
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setGroup("blocked_group")
            .build();

    startForeground(NOTIFICATION_ID, notification);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        isRunning = false;
        if (vpnInterface != null) {
            try {
                vpnInterface.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}