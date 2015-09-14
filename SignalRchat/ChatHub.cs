using Microsoft.AspNet.SignalR;
using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace SignalRchat
{
    public class ChatHub : Hub
    {
        public static List<string> Grupos = new List<string>();
        

        //private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

        public Task Send(string name, string message,string groupName)
        {
            //Logger.Info(string.Format("{0} : {1}",name,message));
            // Call the broadcastMessage method to update clients.


            //Clients.All.broadcastMessage(name, message);

            return Clients.Group(groupName).broadcastMessage(name, message, groupName);

        }

        public void CreateRoom(string roomName)
        {
            if (!Grupos.Contains(roomName))
                Grupos.Add(roomName);

            Clients.All.GrupoCreado(roomName);
        }

        public Task JoinRoom(string roomName)
        {
            //if(!Grupos.Contains(roomName))
            //    CreateRoom(roomName);
            return Groups.Add(Context.ConnectionId, roomName);
        }

        public Task LeaveRoom(string roomName)
        {
            return Groups.Remove(Context.ConnectionId, roomName);
        }

        public List<string> Getgroups()
        {
            return Grupos;
        }

    }
}