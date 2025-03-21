/*package com.blocked;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.net.VpnService;
import android.os.Build;
import android.os.ParcelFileDescriptor;
import android.util.Log;
import androidx.core.app.NotificationCompat;

public class SiteBlockerService extends VpnService {

    private static final String TAG = "SiteBlockerVpnService";
    private static final String CHANNEL_ID = "VPN_CHANNEL";
    private static final int NOTIFICATION_ID = 1;
    private ParcelFileDescriptor vpnInterface;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "Iniciando serviço VPN...");
        
        startForeground(NOTIFICATION_ID, createNotification());

        new Thread(this::startVpn).start(); // Iniciar VPN em uma thread separada

        return START_STICKY;
    }

    private void startVpn() {
        Log.d(TAG, "Configurando VPN...");

        Builder builder = new Builder();
        builder.addAddress("10.0.0.2", 24);  // IP Virtual da VPN
        builder.addRoute("0.0.0.0", 0);      // Capturar todo o tráfego
        builder.setSession("BlockEd VPN");   // Nome da VPN

        vpnInterface = builder.establish();

        if (vpnInterface == null) {
            Log.e(TAG, "Falha ao iniciar a VPN");
            stopSelf();
            return;
        }

        Log.d(TAG, "VPN iniciada com sucesso!");
    }

    private Notification createNotification() {
        String channelName = "Serviço de Bloqueio de Sites";
        NotificationManager manager = getSystemService(NotificationManager.class);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, channelName, NotificationManager.IMPORTANCE_LOW);
            manager.createNotificationChannel(channel);
        }

        Intent intent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_IMMUTABLE);

        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("VPN Ativa")
                .setContentText("Bloqueando sites indesejados")
                .setSmallIcon(R.drawable.ic_launcher_foreground)
                .setOngoing(true)
                .build();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "Parando VPN...");
        if (vpnInterface != null) {
            try {
                vpnInterface.close();
            } catch (Exception e) {
                Log.e(TAG, "Erro ao fechar VPN", e);
            }
        }
    }
}*/


/*
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

public class SiteBlockerService extends VpnService implements Runnable {

    private ParcelFileDescriptor vpnInterface;
    private boolean isRunning = false;
    private static final String CHANNEL_ID = "vpn_service_channel";
    private static final int NOTIFICATION_ID = 1;

    // Lista de sites bloqueados (pode ser carregada dinamicamente depois)
    private final Set<String> blockedSites = new HashSet<>();

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        startForegroundNotification(); // Certifique-se que a notificação está ativa

        if (vpnInterface == null) {
            setupVpn();
        }

        isRunning = true;
        new Thread(this).start(); // Inicia a thread de análise de pacotes

        return START_STICKY;
    }

    private void setupVpn() {
        Builder builder = new Builder();
        builder.addAddress("10.0.0.2", 32); // Endereço IP virtual para a VPN
        builder.addRoute("0.0.0.0", 0); // Redireciona todo tráfego para a VPN
        builder.setBlocking(true); // Garante que o tráfego seja processado corretamente
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
            .build();

    startForeground(NOTIFICATION_ID, notification);
    }

    @Override
    public void onDestroy() {
        isRunning = false;
        if (vpnInterface != null) {
            try {
                vpnInterface.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}*/
/*
package com.blocked;

import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.net.VpnService;
import android.os.ParcelFileDescriptor;
import android.util.Log;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;

public class SiteBlockerService extends VpnService implements Runnable {
    private static final String TAG = "SiteBlockerService";
    private ParcelFileDescriptor vpnInterface;
    private boolean isRunning = true;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.i(TAG, "Iniciando VPN Service...");

        setupVpn();
        new Thread(this).start();
        return START_STICKY;
    }

    private void setupVpn() {
        Builder builder = new Builder();
        builder.addAddress("10.0.0.2", 24);
        builder.addRoute("0.0.0.0", 0);
        builder.addDnsServer("8.8.8.8");
        builder.addDnsServer("8.8.4.4");

        Intent intent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_IMMUTABLE);
        builder.setSession("SiteBlocker VPN").setConfigureIntent(pendingIntent);

        vpnInterface = builder.establish();
    }

    @Override
    public void run() {
        FileInputStream inputStream = new FileInputStream(vpnInterface.getFileDescriptor());
        FileOutputStream outputStream = new FileOutputStream(vpnInterface.getFileDescriptor());
        ByteBuffer buffer = ByteBuffer.allocate(32767);

        while (isRunning) {
            try {
                int length = inputStream.read(buffer.array());
                if (length > 0) {
                    buffer.limit(length);
                    String domain = extractDomain(buffer);
                    if (domain != null) {
                        Log.i(TAG, "Domínio DNS identificado: " + domain);
                    }
                    outputStream.write(buffer.array(), 0, length);
                    buffer.clear();
                }
            } catch (Exception e) {
                Log.e(TAG, "Erro ao processar pacote", e);
                break;
            }
        }
    }

    private String extractDomain(ByteBuffer buffer) {
    try {
        // Salva a posição original do buffer
        int originalPosition = buffer.position();

        // Pula os primeiros 12 bytes do cabeçalho DNS
        if (buffer.remaining() < 12) {
            System.out.println("Erro: Pacote DNS muito curto.");
            return null;
        }
        buffer.position(originalPosition + 12);

        // Construir o domínio a partir do formato DNS
        StringBuilder domainBuilder = new StringBuilder();
        while (buffer.remaining() > 0) {
            int length = buffer.get() & 0xFF; // Lê o comprimento do próximo segmento
            
            // Se length == 0, significa que chegamos ao final do nome do domínio
            if (length == 0) break;

            // Verifica se estamos dentro dos limites do buffer
            if (buffer.remaining() < length) {
                System.out.println("Erro: Posição do buffer fora dos limites.");
                return null;
            }

            // Lê os caracteres do segmento
            byte[] segment = new byte[length];
            buffer.get(segment);
            domainBuilder.append(new String(segment)).append(".");
        }

        // Restaurar a posição original do buffer para não corromper outros processos
        buffer.position(originalPosition);

        // Remove o último ponto, se houver
        if (domainBuilder.length() > 0) {
            domainBuilder.setLength(domainBuilder.length() - 1);
        }

        // Retorna o domínio extraído
        String domain = domainBuilder.toString();
        System.out.println("Domínio DNS identificado: " + domain);
        return domain.isEmpty() ? null : domain;
    } catch (IndexOutOfBoundsException e) {
        System.err.println("Erro ao extrair domínio: Índice fora dos limites.");
        return null;
    } catch (Exception e) {
        System.err.println("Erro inesperado ao extrair domínio: " + e.getMessage());
        return null;
    }
    }


    @Override
    public void onDestroy() {
        isRunning = false;
        try {
            if (vpnInterface != null) vpnInterface.close();
        } catch (Exception ignored) {}
        Log.i(TAG, "SiteBlockerService parado.");
    }
}
*/
/*
package com.blocked;

import android.net.VpnService;
import android.os.ParcelFileDescriptor;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.util.Arrays;

public class SiteBlockerService extends VpnService implements Runnable {
    private Thread thread;
    private ParcelFileDescriptor vpnInterface;

    @Override
    public int onStartCommand(android.content.Intent intent, int flags, int startId) {
        startVpn();
        return START_STICKY;
    }

    private void startVpn() {
        Builder builder = new Builder();
        builder.addAddress("10.0.0.2", 24); // IP da VPN no dispositivo
        builder.addRoute("0.0.0.0", 0); // Captura todo o tráfego
        builder.setSession("MyVpnService");
        vpnInterface = builder.establish();

        if (vpnInterface != null) {
            thread = new Thread(this);
            thread.start();
        }
    }

    @Override
    public void run() {
        FileInputStream inputStream = new FileInputStream(vpnInterface.getFileDescriptor());
        FileOutputStream outputStream = new FileOutputStream(vpnInterface.getFileDescriptor());
        ByteBuffer buffer = ByteBuffer.allocate(32767);

        try {
            while (true) {
                int length = inputStream.read(buffer.array());
                if (length > 0) {
                    processPacket(buffer.array(), length);
                    // Encaminha o pacote de volta para a rede
                    outputStream.write(buffer.array(), 0, length);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void processPacket(byte[] packet, int length) {
        if (length < 20) return; // Pacote inválido

        int protocol = packet[9] & 0xFF;
        byte[] srcIp = Arrays.copyOfRange(packet, 12, 16);
        byte[] destIp = Arrays.copyOfRange(packet, 16, 20);

        String destIpStr = (destIp[0] & 0xFF) + "." + (destIp[1] & 0xFF) + "." + 
                           (destIp[2] & 0xFF) + "." + (destIp[3] & 0xFF);
        
        System.out.println("Pacote interceptado - IP de destino: " + destIpStr);
        
        // (Opcional) Resolver domínio do IP
        new Thread(() -> {
            try {
                java.net.InetAddress addr = java.net.InetAddress.getByName(destIpStr);
                System.out.println("Domínio associado: " + addr.getHostName());
            } catch (Exception ignored) {}
        }).start();
    }

    @Override
    public void onDestroy() {
        if (vpnInterface != null) {
            try {
                vpnInterface.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
*/
/*package com.blocked;

import android.net.VpnService;
import android.os.ParcelFileDescriptor;
import android.util.Log;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.nio.ByteBuffer;

public class SiteBlockerService extends VpnService {
    private static final String TAG = "VPNService";
    private ParcelFileDescriptor vpnInterface;
    private Thread vpnThread;
    private TcpSessionManager sessionManager = new TcpSessionManager();

    @Override
    public int onStartCommand(android.content.Intent intent, int flags, int startId) {
        startVpn();
        return START_STICKY;
    }

    private void startVpn() {
        if (vpnThread != null) return; // Já está rodando

        vpnThread = new Thread(() -> {
            try {
                VpnService.Builder builder = new Builder();
                builder.addAddress("10.0.0.2", 32); // Endereço interno da VPN
                builder.addRoute("0.0.0.0", 0); // Redireciona todo o tráfego
                builder.addDnsServer("8.8.8.8");
                builder.setSession("MyVPN");
                builder.addDisallowedApplication("com.blocked");
                builder.addDisallowedApplication("com.android.systemui");  // UI do sistema
                builder.addDisallowedApplication("com.android.phone");     // Chamadas
                builder.addDisallowedApplication("com.android.settings");  // Configurações
                builder.addDisallowedApplication("com.google.android.gms"); // Serviços Google
                vpnInterface = builder.establish();

                if (vpnInterface == null) {
                    Log.e(TAG, "Falha ao estabelecer VPN");
                    return;
                }

                FileInputStream in = new FileInputStream(vpnInterface.getFileDescriptor());
                FileOutputStream out = new FileOutputStream(vpnInterface.getFileDescriptor());

                ByteBuffer packet = ByteBuffer.allocate(32767);
                while (!Thread.interrupted()) {
                    int length = in.read(packet.array());
                    if (length > 0) {
                        Log.d(TAG, "Pacote capturado, tamanho: " + length);
                        processPacket(packet.array(), length, out);
                        int version = (packet.get(0) >> 4) & 0xF;
                        int protocol = packet.get(9) & 0xFF;

                        int srcIP1 = packet.get(12) & 0xFF;
                        int srcIP2 = packet.get(13) & 0xFF;
                        int srcIP3 = packet.get(14) & 0xFF;
                        int srcIP4 = packet.get(15) & 0xFF;

                        int dstIP1 = packet.get(16) & 0xFF;
                        int dstIP2 = packet.get(17) & 0xFF;
                        int dstIP3 = packet.get(18) & 0xFF;
                        int dstIP4 = packet.get(19) & 0xFF;

                        Log.d("VPNService", "🔍 Origem: " + srcIP1 + "." + srcIP2 + "." + srcIP3 + "." + srcIP4);
                        Log.d("VPNService", "📡 Destino: " + dstIP1 + "." + dstIP2 + "." + dstIP3 + "." + dstIP4);
                    }
                }
            } catch (Exception e) {
                Log.e(TAG, "Erro na VPN", e);
            }
        });

        vpnThread.start();
    }

   private void processPacket(byte[] data, int length, FileOutputStream out) {
    try {
        int ipHeaderLength = (data[0] & 0x0F) * 4; // Tamanho do cabeçalho IP
        int tcpHeaderStart = ipHeaderLength;

        int srcPort = ((data[tcpHeaderStart] & 0xFF) << 8) | (data[tcpHeaderStart + 1] & 0xFF);
        int destPort = ((data[tcpHeaderStart + 2] & 0xFF) << 8) | (data[tcpHeaderStart + 3] & 0xFF);


        Log.d("VPNService", "🔎 Processando pacote: Destino " + destPort);

        if (destPort == 80 || destPort == 443) { 
            Log.d("VPNService", "🌐 Redirecionando tráfego HTTP/HTTPS para proxy...");
            sendToProxy(data, length);
        } else {
            Log.d("VPNService", "⏩ Pacote ignorado (porta diferente de HTTP/HTTPS)");
            out.write(data, 0, length);
        }
    } catch (Exception e) {
        Log.e("VPNService", "Erro ao processar pacote", e);
    }
}



    private String getSessionKey(byte[] data) {
        int srcPort = ((data[0] & 0xFF) << 8) | (data[1] & 0xFF);
        int destPort = ((data[2] & 0xFF) << 8) | (data[3] & 0xFF);
        return srcPort + ":" + destPort;
    }




   private void sendToProxy(byte[] data, int length) {
    try {
        Log.d("VPNService", "📤 Enviando pacote ao proxy (" + length + " bytes)");

        Socket proxySocket = new Socket("127.0.0.1", 8080); // Proxy na porta 8080
        OutputStream out = proxySocket.getOutputStream();
        out.write(data, 0, length);
        out.flush();
        proxySocket.close();

        Log.d("VPNService", "✅ Pacote enviado com sucesso ao proxy!");
    } catch (Exception e) {
        Log.e("VPNService", "❌ Erro ao encaminhar para o proxy", e);
    }
}



    @Override
    public void onDestroy() {
        super.onDestroy();
        try {
            if (vpnInterface != null) vpnInterface.close();
            if (vpnThread != null) vpnThread.interrupt();
        } catch (Exception ignored) {}
    }
}
*/
package com.blocked;
/*
import android.net.VpnService;
import android.os.ParcelFileDescriptor;
import org.pcap4j.packet.*;
import org.pcap4j.packet.namednumber.*;
import org.pcap4j.util.ByteArrays;
import org.pcap4j.packet.IpV4Packet;
import org.pcap4j.packet.TcpPacket;
import org.pcap4j.packet.UdpPacket;
import io.netty.bootstrap.Bootstrap;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioSocketChannel;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.util.concurrent.ConcurrentHashMap;

public class SiteBlockerService extends VpnService {

    private ParcelFileDescriptor vpnInterface;
    private Thread vpnThread;
    private boolean isRunning = false;
    private final ConcurrentHashMap<String, Channel> tcpChannels = new ConcurrentHashMap<>();

    @Override
    public int onStartCommand(android.content.Intent intent, int flags, int startId) {
        startVPN();
        return START_STICKY;
    }

    private void startVPN() {
        Builder builder = new Builder();
        try {
            builder.setSession("SmartVPN")
                   .addAddress("10.0.0.2", 24)
                   .addRoute("0.0.0.0", 0)
                   .addDnsServer("8.8.8.8")
                   .setBlocking(true);

            vpnInterface = builder.establish();
            isRunning = true;
            vpnThread = new Thread(this::packetProcessingLoop);
            vpnThread.start();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void packetProcessingLoop() {
        try (FileInputStream in = new FileInputStream(vpnInterface.getFileDescriptor())) {
            ByteBuffer buffer = ByteBuffer.allocate(65536);
            while (isRunning) {
                int length = in.read(buffer.array());
                if (length > 0) {
                    byte[] rawPacket = ByteArrays.getSubArray(buffer.array(), 0, length);
                    processPacket(rawPacket);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void processPacket(byte[] rawPacket) {
        try {
            // Correção 1: Analisar como IPv4 explicitamente
            IpV4Packet ipPacket = (IpV4Packet) IpV4Packet.newPacket(rawPacket, 0, rawPacket.length);

            if (ipPacket.getPayload() instanceof TcpPacket) {
                handleTcp(ipPacket);
            } else if (ipPacket.getPayload() instanceof UdpPacket) {
                handleUdp(ipPacket);
            } else {
                forwardPacket(rawPacket);
            }
        } catch (Exception e) {
            forwardPacket(rawPacket);
        }
    }

    private void handleTcp(IpPacket ipPacket) {
        TcpPacket tcpPacket = (TcpPacket) ipPacket.getPayload();
        int destPort = tcpPacket.getHeader().getDstPort().valueAsInt();

        if (destPort == 80) {
            processHttp(ipPacket, tcpPacket);
        } else if (destPort == 443) {
            processHttps(ipPacket, tcpPacket);
        } else {
            forwardPacket(ipPacket.getRawData());
        }
    }

    private void processHttps(IpPacket ipPacket, TcpPacket tcpPacket) {
        byte[] payload = tcpPacket.getPayload() != null ? 
            tcpPacket.getPayload().getRawData() : new byte[0];

        // Detectar handshake TLS
        if (payload.length > 0 && (payload[0] == 0x16)) {
            System.out.println("TLS Handshake detectado - Conexão HTTPS");
            
            // Exemplo: Modificar payload (apenas demonstração)
            // byte[] modifiedPayload = Arrays.copyOf(payload, payload.length);
            // modifiedPayload[10] = 0x01; // Modificação fictícia
            // byte[] newPacket = rebuildPacket(ipPacket, modifiedPayload);
            // forwardPacket(newPacket);
            // return;
        }
        
        forwardPacket(ipPacket.getRawData());
    }

    private byte[] rebuildPacket(IpV4Packet originalIpPacket, byte[] newPayload) {
    try {
        IpV4Packet.Builder ipBuilder = originalIpPacket.getBuilder();
        
        if (originalIpPacket.getPayload() instanceof TcpPacket) {
            TcpPacket originalTcp = (TcpPacket) originalIpPacket.getPayload();
            TcpPacket.Builder tcpBuilder = originalTcp.getBuilder();
            
            tcpBuilder.payloadBuilder(
                new UnknownPacket.Builder()
                    .rawData(newPayload)
            );
            
            // Configurar para recalcular checksum automaticamente
            tcpBuilder
                .correctChecksumAtBuild(true)
                .correctLengthAtBuild(true);

            ipBuilder.payloadBuilder(tcpBuilder)
                .correctChecksumAtBuild(true)
                .correctLengthAtBuild(true);
        }
        
        IpV4Packet newIpPacket = ipBuilder.build();
        return newIpPacket.getRawData();
    } catch (Exception e) {
        e.printStackTrace();
        return originalIpPacket.getRawData();
    }
    }

    private void handleUdp(IpPacket ipPacket) {
        UdpPacket udpPacket = (UdpPacket) ipPacket.getPayload();
        int destPort = udpPacket.getHeader().getDstPort().valueAsInt();
        
        if (destPort == 53) {
            processDns(ipPacket, udpPacket);
        } else {
            forwardPacket(ipPacket.getRawData());
        }
    }

    private void processDns(IpPacket ipPacket, UdpPacket udpPacket) {
        try {
            byte[] payload = udpPacket.getPayload().getRawData();
            if (payload.length > 0) {
                // Exemplo: Logar consultas DNS (primeiro byte é o ID da consulta)
                System.out.println("DNS Query ID: " + (payload[0] & 0xFF));
            }

            forwardPacket(ipPacket.getRawData());
        } catch (Exception e) {
            forwardPacket(ipPacket.getRawData());
        }
    }

    private void processHttp(IpPacket ipPacket, TcpPacket tcpPacket) {
        String connKey = generateTcpKey(ipPacket, tcpPacket);
        byte[] payload = tcpPacket.getPayload() != null ? 
            tcpPacket.getPayload().getRawData() : new byte[0];

        if (tcpPacket.getHeader().getSyn() && !tcpPacket.getHeader().getAck()) {
            setupProxyConnection(ipPacket, tcpPacket, connKey);
        } else if (payload.length > 0) {
            forwardToProxy(connKey, payload);
        }
    }

    private void setupProxyConnection(IpPacket ipPacket, TcpPacket tcpPacket, String key) {
        NioEventLoopGroup group = new NioEventLoopGroup();
        Bootstrap bootstrap = new Bootstrap();
        bootstrap.group(group)
                .channel(NioSocketChannel.class)
                .handler(new ChannelInitializer<Channel>() {
                    @Override
                    protected void initChannel(Channel ch) {
                        ch.pipeline().addLast(new ProxyHandler(key));
                    }
                });

        try {
            InetSocketAddress dest = new InetSocketAddress(
                ipPacket.getHeader().getDstAddr().getHostAddress(),
                tcpPacket.getHeader().getDstPort().valueAsInt()
            );
            
            ChannelFuture future = bootstrap.connect(dest).sync();
            tcpChannels.put(key, future.channel());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private void forwardToProxy(String key, byte[] data) {
        Channel channel = tcpChannels.get(key);
        if (channel != null && channel.isActive()) {
            channel.writeAndFlush(ByteBuffer.wrap(data));
        }
    }

    private void forwardPacket(byte[] packet) {
        try (FileOutputStream out = new FileOutputStream(vpnInterface.getFileDescriptor())) {
            out.write(packet);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private String generateTcpKey(IpPacket ipPacket, TcpPacket tcpPacket) {
        return ipPacket.getHeader().getSrcAddr() + ":" + tcpPacket.getHeader().getSrcPort() + ">" +
               ipPacket.getHeader().getDstAddr() + ":" + tcpPacket.getHeader().getDstPort();
    }

    @Override
    public void onDestroy() {
        isRunning = false;
        try {
            vpnInterface.close();
            tcpChannels.values().forEach(Channel::close);
        } catch (IOException e) {
            e.printStackTrace();
        }
        super.onDestroy();
    }

    private class ProxyHandler extends ChannelInboundHandlerAdapter {
        private final String connectionKey;

        public ProxyHandler(String connectionKey) {
            this.connectionKey = connectionKey;
        }

        @Override
        public void channelRead(ChannelHandlerContext ctx, Object msg) {
            try {
                ByteBuffer buffer = (ByteBuffer) msg;
                byte[] response = new byte[buffer.remaining()];
                buffer.get(response);
                forwardPacket(response);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        @Override
        public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
            cause.printStackTrace();
            ctx.close();
            tcpChannels.remove(connectionKey);
        }
    }
}*/
/*
import android.net.VpnService;
import android.os.ParcelFileDescriptor;
import android.util.Log;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class SiteBlockerService extends VpnService {

    private static final String TAG = "SmartVPN";
    private ParcelFileDescriptor vpnInterface;
    private ExecutorService executor;
    private volatile boolean isRunning = false;

    @Override
    public int onStartCommand(android.content.Intent intent, int flags, int startId) {
        startVPN();
        return START_STICKY;
    }

    private void startVPN() {
        try {
            Builder builder = new Builder()
                .setSession("SmartVPN")
                .addAddress("10.0.0.2", 24)
                .addRoute("0.0.0.0", 0)
                .addDnsServer("8.8.8.8")
                .setMtu(1500)
                .setBlocking(false);  // Modo não bloqueante

            vpnInterface = builder.establish();
            isRunning = true;
            
            // Thread pool para processamento paralelo
            executor = Executors.newFixedThreadPool(2);
            executor.execute(this::handleIncoming);
            executor.execute(this::handleOutgoing);

        } catch (Exception e) {
            Log.e(TAG, "VPN initialization failed", e);
            cleanup();
        }
    }

    private void handleIncoming() {
        try (FileInputStream in = new FileInputStream(vpnInterface.getFileDescriptor())) {
            ByteBuffer buffer = ByteBuffer.allocate(65536);
            while (isRunning) {
                int bytesRead = in.read(buffer.array());
                if (bytesRead > 0) {
                    forwardPacket(buffer.array(), bytesRead);
                    buffer.clear();
                }
            }
        } catch (IOException e) {
            Log.e(TAG, "Incoming traffic error", e);
        }
    }

    private void handleOutgoing() {
        try (FileOutputStream out = new FileOutputStream(vpnInterface.getFileDescriptor())) {
            // Implementar lógica de envio se necessário
            while (isRunning) {
                Thread.sleep(100); // Evitar consumo excessivo de CPU
            }
        } catch (Exception e) {
            Log.e(TAG, "Outgoing traffic error", e);
        }
    }

    private synchronized void forwardPacket(byte[] packet, int length) {
        try {
            FileOutputStream out = new FileOutputStream(vpnInterface.getFileDescriptor());
            out.write(packet, 0, length);
        } catch (IOException e) {
            Log.e(TAG, "Packet forwarding failed", e);
        }
    }

    private void cleanup() {
        try {
            isRunning = false;
            if (executor != null) executor.shutdownNow();
            if (vpnInterface != null) vpnInterface.close();
        } catch (IOException e) {
            Log.e(TAG, "Cleanup error", e);
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        cleanup();
    }
}
*/

import android.net.VpnService;
import android.os.ParcelFileDescriptor;
import android.util.Log;
import java.io.FileInputStream;
import java.net.InetAddress;
import java.net.Inet4Address;
import java.nio.ByteBuffer;
import java.io.IOException;
import android.content.Intent;

public class SiteBlockerService extends VpnService {

    private static final String TAG = "FocusedVPN";
    private ParcelFileDescriptor vpnInterface;
    private String targetDomain = "www.facebook.com"; // Domínio alvo

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "Serviço iniciado");
        new Thread(() -> {
            try {
                // Configuração da VPN
                Builder builder = new Builder();
                builder.setSession("FocusedVPN")
                       .addAddress("10.0.0.2", 24)
                       .addDnsServer("8.8.8.8");

                // Adiciona rotas para o domínio desejado (ex: example.com)
                InetAddress[] ips = InetAddress.getAllByName(targetDomain);
                for (InetAddress ip : ips) {
                    String ipStr = ip.getHostAddress();
                    int mask = (ip instanceof Inet4Address) ? 32 : 128;
                    builder.addRoute(ipStr, mask);
                    Log.d(TAG, "Rota adicionada: " + ipStr + "/" + mask);
                }

                vpnInterface = builder.establish();
                if (vpnInterface == null) {
                    Log.e(TAG, "Falha ao estabelecer a VPN");
                    return;
                }

                Log.d(TAG, "VPN ativa. Interface: " + vpnInterface.getFileDescriptor());

            } catch (Exception e) {
                Log.e(TAG, "Erro na VPN: " + e.getMessage());
                stopSelf();
            }
        }).start();

        return START_STICKY;
    }

    private void captureTraffic() {
        try (FileInputStream in = new FileInputStream(vpnInterface.getFileDescriptor())) {
            ByteBuffer packet = ByteBuffer.allocate(32767);

            // Só receberá pacotes destinados aos IPs do domínio
            while (true) {
                int length = in.read(packet.array());
                if (length > 0) {
                    packet.limit(length);
                    Log.d(TAG, "Pacote capturado (tamanho: " + length + " bytes)");
                    packet.clear();
                }
            }
        } catch (IOException e) {
            Log.e(TAG, "Erro na captura: " + e.getMessage());
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        try {
            if (vpnInterface != null) {
                vpnInterface.close();
            }
        } catch (IOException e) {
            Log.e(TAG, "Erro ao fechar VPN: " + e.getMessage());
        }
    }
}