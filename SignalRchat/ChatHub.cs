using Microsoft.AspNet.SignalR;
using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SignalRchat
{
    public class ChatHub : Hub
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

        public void Send(string name, string message)
        {
            Logger.Info(string.Format("{0} : {1}",name,message));
            // Call the broadcastMessage method to update clients.
            Clients.All.broadcastMessage(name, message);
        }
    }
}