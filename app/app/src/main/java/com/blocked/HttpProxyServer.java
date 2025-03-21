/*import java.io.*;
import java.net.*;

public class Socks5ProxyServer {
    private static final int PORT = 1080; // Porta padrão do SOCKS5

    public static void main(String[] args) {
        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            System.out.println("Servidor SOCKS5 rodando na porta " + PORT);

            while (true) {
                Socket clientSocket = serverSocket.accept();
                new Thread(() -> handleClient(clientSocket)).start();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void handleClient(Socket clientSocket) {
        try (InputStream in = clientSocket.getInputStream();
             OutputStream out = clientSocket.getOutputStream()) {

            // 1. Leitura da versão e métodos suportados
            byte[] handshake = new byte[2];
            in.read(handshake);
            if (handshake[0] != 0x05) {
                System.out.println("Protocolo não suportado");
                clientSocket.close();
                return;
            }

            int methods = handshake[1];
            byte[] methodsAccepted = new byte[methods];
            in.read(methodsAccepted);

            // 2. Responder ao cliente que nenhuma autenticação é necessária (0x00)
            out.write(new byte[]{0x05, 0x00});

            // 3. Leitura da requisição do cliente
            byte[] request = new byte[4];
            in.read(request);
            if (request[1] != 0x01) { // Apenas comando CONNECT suportado
                System.out.println("Comando não suportado");
                clientSocket.close();
                return;
            }

            // 4. Identificar destino
            byte addressType = request[3];
            byte[] address;
            String host;
            if (addressType == 0x01) { // IPv4
                address = new byte[4];
                in.read(address);
                host = InetAddress.getByAddress(address).getHostAddress();
            } else if (addressType == 0x03) { // Domínio
                int domainLength = in.read(); // Lê o tamanho do domínio
                byte[] domainBytes = new byte[domainLength];
                in.read(domainBytes);
                host = new String(domainBytes);
            } else {
                System.out.println("Tipo de endereço não suportado: " + addressType);
                clientSocket.close();
                return;
            }


            byte[] portBytes = new byte[2];
            in.read(portBytes);
            int port = ((portBytes[0] & 0xFF) << 8) | (portBytes[1] & 0xFF);

            System.out.println("Encaminhando para " + host + ":" + port);

            // 5. Conectar ao destino real
            try (Socket remoteSocket = new Socket(host, port)) {
                out.write(new byte[]{0x05, 0x00, 0x00, 0x01, 0, 0, 0, 0, portBytes[0], portBytes[1]});

                // 6. Encaminhar tráfego entre o cliente e o destino real
                Thread t1 = new Thread(() -> forwardTraffic(in, remoteSocket));
                Thread t2 = new Thread(() -> {
                    try {
                        forwardTraffic(remoteSocket.getInputStream(), clientSocket);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                });


                t1.start();
                t2.start();
                t1.join();
                t2.join();
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void forwardTraffic(InputStream in, Socket outSocket) {
    try (OutputStream out = outSocket.getOutputStream()) {
        byte[] buffer = new byte[4096];
        int bytesRead;
        while ((bytesRead = in.read(buffer)) != -1) {
            System.out.println("Encaminhando " + bytesRead + " bytes...");
            out.write(buffer, 0, bytesRead);
            out.flush();
        }
        System.out.println("Nenhum dado restante. Encerrando conexão.");
    } catch (IOException e) {
        System.out.println("Erro ao encaminhar tráfego: " + e.getMessage());
    }
    }
}
*/
/*
import java.io.*;
import java.net.*;

public class HttpProxyServer {
    private static final int PORT = 8080;

    public static void main(String[] args) {
        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            System.out.println("Proxy HTTP rodando na porta " + PORT);

            while (true) {
                Socket clientSocket = serverSocket.accept();
                new Thread(() -> handleClient(clientSocket)).start();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void handleClient(Socket clientSocket) {
        try (
            InputStream in = clientSocket.getInputStream();
            OutputStream out = clientSocket.getOutputStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(in));
            PrintWriter writer = new PrintWriter(out, true)
        ) {
            String requestLine = reader.readLine();
            if (requestLine == null) {
                clientSocket.close();
                return;
            }

            System.out.println("Requisição: " + requestLine);
            String[] parts = requestLine.split(" ");
            if (parts.length < 3) {
                System.out.println("Requisição malformada.");
                clientSocket.close();
                return;
            }

            String method = parts[0];
            String url = parts[1];

            if (method.equalsIgnoreCase("CONNECT")) {
                handleHttpsTunnel(clientSocket, url, reader, writer);
            } else {
                forwardHttpRequest(clientSocket, method, url, reader, writer);
            }

        } catch (IOException e) {
            System.out.println("Erro ao processar cliente: " + e.getMessage());
        }
    }

    private static void handleHttpsTunnel(Socket clientSocket, String url, BufferedReader reader, PrintWriter writer) throws IOException {
        String[] hostParts = url.split(":");
        String host = hostParts[0];
        int port = (hostParts.length > 1) ? Integer.parseInt(hostParts[1]) : 443;

        System.out.println("Criando túnel HTTPS para " + host + ":" + port);

        try (Socket remoteSocket = new Socket(host, port)) {
            writer.println("HTTP/1.1 200 Connection Established");
            writer.println("Proxy-Agent: Java-Proxy");
            writer.println();
            writer.flush();

            // Encaminhar tráfego entre cliente e destino
            Thread t1 = new Thread(() -> forwardTraffic(clientSocket, remoteSocket));
            Thread t2 = new Thread(() -> forwardTraffic(remoteSocket, clientSocket));
            t1.start();
            t2.start();
            t1.join();
            t2.join();
        } catch (Exception e) {
            System.out.println("Erro no túnel HTTPS: " + e.getMessage());
        }
    }

    private static void forwardHttpRequest(Socket clientSocket, String method, String url, BufferedReader reader, PrintWriter writer) throws IOException {
        URL targetUrl = new URL(url);
        String host = targetUrl.getHost();
        int port = (targetUrl.getPort() == -1) ? targetUrl.getDefaultPort() : targetUrl.getPort();

        System.out.println("Encaminhando requisição HTTP para " + host + ":" + port);

        try (Socket remoteSocket = new Socket(host, port);
             PrintWriter remoteWriter = new PrintWriter(remoteSocket.getOutputStream(), true);
             BufferedReader remoteReader = new BufferedReader(new InputStreamReader(remoteSocket.getInputStream()))) {

            // Reenviar a requisição HTTP para o destino
            remoteWriter.println(method + " " + targetUrl.getFile() + " HTTP/1.1");
            remoteWriter.println("Host: " + host);
            remoteWriter.println("Connection: close");
            remoteWriter.println();
            remoteWriter.flush();

            // Encaminhar a resposta do destino de volta para o cliente
            String responseLine;
            while ((responseLine = remoteReader.readLine()) != null) {
                writer.println(responseLine);
            }
            writer.flush();
        }
    }

    private static void forwardTraffic(Socket inputSocket, Socket outputSocket) {
        try (
            InputStream in = inputSocket.getInputStream();
            OutputStream out = outputSocket.getOutputStream()
        ) {
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = in.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
                out.flush();
            }
        } catch (IOException e) {
            System.out.println("Conexão encerrada.");
        }
    }
}
*/

import java.io.*;
import java.net.*;

public class HttpProxyServer {
    private static final int PORT = 8080;

    public static void main(String[] args) {
        System.out.println("Proxy HTTP rodando na porta " + PORT);
        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            while (true) {
                Socket clientSocket = serverSocket.accept();
                new Thread(() -> handleClient(clientSocket)).start();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void handleClient(Socket clientSocket) {
        try (
            InputStream clientInput = clientSocket.getInputStream();
            OutputStream clientOutput = clientSocket.getOutputStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(clientInput));
            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(clientOutput))
        ) {
            String requestLine = reader.readLine();
            if (requestLine == null) return;

            System.out.println("Requisição: " + requestLine);
            
            if (requestLine.startsWith("CONNECT")) {
                handleHttpsTunnel(requestLine, reader, clientSocket);
            } else {
                forwardHttpRequest(requestLine, reader, writer, clientSocket);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void handleHttpsTunnel(String requestLine, BufferedReader reader, Socket clientSocket) throws IOException {
        String[] parts = requestLine.split(" ");
        if (parts.length < 2) return;

        String[] hostParts = parts[1].split(":");
        String host = hostParts[0];
        int port = hostParts.length > 1 ? Integer.parseInt(hostParts[1]) : 443;

        System.out.println("Criando túnel HTTPS para " + host + ":" + port);

        try (Socket remoteSocket = new Socket(host, port)) {
            OutputStream clientOutput = clientSocket.getOutputStream();
            clientOutput.write("HTTP/1.1 200 Connection Established\r\nProxy-Agent: Java-Proxy\r\n\r\n".getBytes());
            clientOutput.flush();
            
            Thread forward = new Thread(() -> forwardTraffic(clientSocket, remoteSocket));
            Thread backward = new Thread(() -> forwardTraffic(remoteSocket, clientSocket));
            forward.start();
            backward.start();
            forward.join();
            backward.join();
        } catch (IOException | InterruptedException e) {
            System.err.println("Erro ao criar túnel: " + e.getMessage());
        }
    }

    private static void forwardHttpRequest(String requestLine, BufferedReader reader, BufferedWriter writer, Socket clientSocket) throws IOException {
        String[] parts = requestLine.split(" ");
        if (parts.length < 2) return;

        URL url = new URL(parts[1]);
        Socket remoteSocket = new Socket(url.getHost(), url.getPort() == -1 ? 80 : url.getPort());
        OutputStream remoteOutput = remoteSocket.getOutputStream();
        InputStream remoteInput = remoteSocket.getInputStream();

        BufferedWriter remoteWriter = new BufferedWriter(new OutputStreamWriter(remoteOutput));
        BufferedReader remoteReader = new BufferedReader(new InputStreamReader(remoteInput));

        remoteWriter.write(requestLine + "\r\n");
        String line;
        while (!(line = reader.readLine()).isEmpty()) {
            remoteWriter.write(line + "\r\n");
        }
        remoteWriter.write("\r\n");
        remoteWriter.flush();

        while ((line = remoteReader.readLine()) != null) {
            writer.write(line + "\r\n");
            writer.flush();
        }
        remoteSocket.close();
        clientSocket.close();
    }

    private static void forwardTraffic(Socket inSocket, Socket outSocket) {
        try (
            InputStream in = inSocket.getInputStream();
            OutputStream out = outSocket.getOutputStream()
        ) {
            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = in.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
                out.flush();
            }
        } catch (IOException e) {
            System.err.println("Erro ao encaminhar tráfego: " + e.getMessage());
        }
    }
}