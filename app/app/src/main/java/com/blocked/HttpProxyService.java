package com.blocked;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;

public class HttpProxyService extends Service {
    private static final String TAG = "HttpProxyService";
    private static final int PORT = 8080;
    private boolean isRunning = false;
    private Thread serverThread;

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
        startForeground(1, getNotification());
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (!isRunning) {
            isRunning = true;
            serverThread = new Thread(this::startProxyServer);
            serverThread.start();
        }
        return START_STICKY;
    }

    private void startProxyServer() {
        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            Log.i(TAG, "Proxy HTTP iniciado na porta " + PORT);
            while (isRunning) {
                Socket clientSocket = serverSocket.accept();
                new Thread(() -> handleClient(clientSocket)).start();
            }
        } catch (Exception e) {
            Log.e(TAG, "Erro no servidor proxy", e);
        }
    }

    private void handleClient(Socket clientSocket) {
        try {
            BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
            OutputStream out = clientSocket.getOutputStream();

            String requestLine = in.readLine();
            Log.i(TAG, "Requisição recebida: " + requestLine);

            if (requestLine == null) {
                clientSocket.close();
                return;
            }

            String[] parts = requestLine.split(" ");
            if (parts.length < 3) {
                clientSocket.close();
                return;
            }

            String method = parts[0];
            String url = parts[1];

            // Tratar conexões HTTPS (CONNECT)
            if ("CONNECT".equalsIgnoreCase(method)) {
                handleHttps(clientSocket, in, out, url);
            } else {
                handleHttp(clientSocket, in, out, requestLine);
            }
        } catch (Exception e) {
            Log.e(TAG, "Erro ao lidar com cliente", e);
        }
    }

    private void handleHttps(Socket clientSocket, BufferedReader in, OutputStream out, String url) {
        try {
            String[] hostParts = url.split(":");
            String host = hostParts[0];
            int port = hostParts.length > 1 ? Integer.parseInt(hostParts[1]) : 443;

            // Conectar ao servidor HTTPS real
            Socket serverSocket = new Socket(host, port);
            Log.i(TAG, "Encaminhando conexão HTTPS para " + host + ":" + port);

            // Responder ao cliente que a conexão foi estabelecida
            out.write("HTTP/1.1 200 Connection Established\r\n\r\n".getBytes());
            out.flush();

            // Criar threads para redirecionar os fluxos de dados
            Thread clientToServer = new Thread(() -> forwardData(clientSocket, serverSocket));
            Thread serverToClient = new Thread(() -> forwardData(serverSocket, clientSocket));

            clientToServer.start();
            serverToClient.start();

            clientToServer.join();
            serverToClient.join();

            clientSocket.close();
            serverSocket.close();
        } catch (Exception e) {
            Log.e(TAG, "Erro ao processar HTTPS", e);
        }
    }

    private void handleHttp(Socket clientSocket, BufferedReader in, OutputStream out, String firstLine) {
        try {
            // Lendo cabeçalhos
            StringBuilder requestHeaders = new StringBuilder(firstLine).append("\r\n");
            String line;
            while ((line = in.readLine()) != null && !line.isEmpty()) {
                requestHeaders.append(line).append("\r\n");
            }
            requestHeaders.append("\r\n");

            // Extrair host do cabeçalho
            String host = extractHost(requestHeaders.toString());
            if (host == null) {
                clientSocket.close();
                return;
            }

            // Conectar ao servidor real
            Socket serverSocket = new Socket(host, 80);
            OutputStream serverOut = serverSocket.getOutputStream();
            InputStream serverIn = serverSocket.getInputStream();

            // Enviar requisição para o servidor real
            serverOut.write(requestHeaders.toString().getBytes());
            serverOut.flush();

            // Encaminhar resposta do servidor para o cliente
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = serverIn.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
                out.flush();
            }

            // Fechar conexões
            clientSocket.close();
            serverSocket.close();
        } catch (Exception e) {
            Log.e(TAG, "Erro ao processar HTTP", e);
        }
    }

    private void forwardData(Socket inputSocket, Socket outputSocket) {
        try {
            InputStream in = inputSocket.getInputStream();
            OutputStream out = outputSocket.getOutputStream();

            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = in.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
                out.flush();
            }
        } catch (IOException e) {
            Log.e(TAG, "Erro ao encaminhar dados", e);
        }
    }

    private String extractHost(String headers) {
        for (String line : headers.split("\r\n")) {
            if (line.toLowerCase().startsWith("host:")) {
                return line.split(":")[1].trim();
            }
        }
        return null;
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    "PROXY_CHANNEL",
                    "Proxy HTTP",
                    NotificationManager.IMPORTANCE_LOW
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }

    private Notification getNotification() {
        return new Notification.Builder(this, "PROXY_CHANNEL")
                .setContentTitle("Proxy HTTP em execução")
                .setContentText("O proxy HTTP está rodando em segundo plano")
                .setSmallIcon(R.drawable.ic_launcher_foreground)
                .build();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        isRunning = false;
        if (serverThread != null) {
            serverThread.interrupt();
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
