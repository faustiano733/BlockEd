package com.blocked;
/*
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




import android.net.VpnService;
import android.os.ParcelFileDescriptor;
import android.util.Log;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.InetAddress;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import android.content.Intent;

import java.nio.ByteBuffer;
import java.util.Arrays;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.os.Build;
import android.util.Log;
import androidx.core.app.NotificationCompat;
//import java.util.Thread;


public class SiteBlockerService extends VpnService {

    private static final String TAG = "SiteBlockerService";
    private static final String FILE_PATH = "/storage/emulated/0/Documents/blocked_sites.txt"; // Caminho do ficheiro
    private static final long IP_UPDATE_INTERVAL = 1; // Intervalo para atualizar IPs (em minutos)
    private static final long DOMAIN_UPDATE_INTERVAL = 1; // Intervalo para atualizar domínios (em minutos)

    private ParcelFileDescriptor vpnInterface;
    private Set<String> domains = new HashSet<>(); // Conjunto de domínios
    private Set<String> ips = new HashSet<>(); // Conjunto de IPs
    private ScheduledExecutorService scheduler;
    private boolean isRunning = false; // Flag para verificar se o serviço já está em execução

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        
        if(intent != null){
            //stopSelf();
            //return START_NOT_STICKY;
            String intentAction = (String) intent.getAction();

            if("STOP_VPN".equals(intentAction)){
                System.out.println("Tentando parar");
                this.stopForeground(true);
                this.onDestroy();
                return START_NOT_STICKY;
            }
        }
        
        // Verifica se o serviço já está em execução
        if (isRunning) {
            Log.d(TAG, "Serviço já está em execução. Ignorando nova inicialização.");
            return START_STICKY;
        }

        // Marca o serviço como em execução
        isRunning = true;
        

        // Passo 1: Ler o ficheiro de domínios
        readDomainsFromFile();

        // Passo 2: Resolver os domínios e configurar a VPN
        resolveDomainsAndSetupVPN();

        // Passo 3: Iniciar as threads de atualização
        startUpdateThreads();

        return START_STICKY;
    }

    // Ler o ficheiro de domínios
    private void readDomainsFromFile() {
        domains.clear(); // Limpa o conjunto atual
        File file = new File(FILE_PATH);
        if (!file.exists()) {
            Log.e(TAG, "Ficheiro não encontrado: " + FILE_PATH);
            return;
        }

        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                domains.add(line.trim()); // Adiciona cada domínio ao conjunto
            }
            Log.d(TAG, "Domínios lidos: " + domains.size());
        } catch (IOException e) {
            Log.e(TAG, "Erro ao ler ficheiro: " + e.getMessage());
        }
    }

    // Resolver os domínios e configurar a VPN
    private void resolveDomainsAndSetupVPN() {
        ips.clear(); // Limpa o conjunto atual de IPs
        for (String domain : domains) {
            try {
                InetAddress[] addresses = InetAddress.getAllByName(domain);
                for (InetAddress address : addresses) {
                    ips.add(address.getHostAddress().toString()); // Adiciona cada IP ao conjunto
                }
            } catch (Exception e) {
                Log.e(TAG, "Erro ao resolver domínio: " + domain);
            }
        }

        /*for (String domain : targetDomains) {
                    InetAddress[] ips = InetAddress.getAllByName(domain);
                    for (InetAddress ip : ips) {
                        String ipStr = ip.getHostAddress();
                        int mask = (ip instanceof Inet4Address) ? 32 : 128;
                        builder.addRoute(ipStr, mask);  // APENAS esses IPs passarão pela VPN
                        Log.d(TAG, "Rota adicionada: " + ipStr + "/" + mask);
                    }
                }*/

        Log.d(TAG, "IPs resolvidos: " + ips.size());

        // Configurar a VPN com os IPs resolvidos
        setupVPN();
    }

    // Configurar a VPN
    private void setupVPN() {
        Builder builder = new Builder()
            .setSession("DynamicVPN")
            .addAddress("10.0.0.2", 24);

        // Adicionar rotas para os IPs
        for (String ip : ips) {
            builder.addRoute(ip, 32);
        }

        // Estabelecer a VPN
        if (vpnInterface != null) {
            try {
                vpnInterface.close();
            } catch (IOException e) {
                Log.e(TAG, "Erro ao fechar VPN: " + e.getMessage());
            }
        }

        vpnInterface = builder.establish();
        if (vpnInterface == null) {
            Log.e(TAG, "Falha ao estabelecer a VPN");
            stopSelf();
        }
    }

    // Iniciar as threads de atualização
    private void startUpdateThreads() {
        scheduler = Executors.newScheduledThreadPool(2);

        // Thread 1: Atualizar IPs periodicamente
        scheduler.scheduleAtFixedRate(() -> {
            Log.d(TAG, "Atualizando IPs...");
            resolveDomainsAndSetupVPN();
        }, IP_UPDATE_INTERVAL, IP_UPDATE_INTERVAL, TimeUnit.MINUTES);

        // Thread 2: Atualizar domínios periodicamente
        scheduler.scheduleAtFixedRate(() -> {
            Log.d(TAG, "Atualizando domínios...");
            readDomainsFromFile();
            resolveDomainsAndSetupVPN();
        }, DOMAIN_UPDATE_INTERVAL, DOMAIN_UPDATE_INTERVAL, TimeUnit.MINUTES);
    }

    

    @Override
    public void onDestroy() {
        super.onDestroy();
        // Marca o serviço como parado
        System.out.println("Parando VPN...");
        isRunning = false;

        // Encerra as threads ao parar o serviço
        if (scheduler != null) {
            scheduler.shutdown();
        }

        // Fecha a VPN
        if (vpnInterface != null) {
            try {
                vpnInterface.close();
                System.out.println("Parado de facto");
            } catch (IOException e) {
                Log.e(TAG, "Erro ao fechar VPN: " + e.getMessage());
            }
        }
    }
}