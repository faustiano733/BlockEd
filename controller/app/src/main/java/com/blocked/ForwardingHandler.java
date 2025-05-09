package com.blocked;

import io.netty.buffer.ByteBuf;
import io.netty.channel.*;

public class ForwardingHandler extends SimpleChannelInboundHandler<ByteBuf> {

    private final ChannelHandlerContext clientCtx;

    public ForwardingHandler(ChannelHandlerContext clientCtx) {
        this.clientCtx = clientCtx;
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, ByteBuf msg) {
        clientCtx.writeAndFlush(msg.retain());
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        cause.printStackTrace();
        ctx.close();
    }
}
