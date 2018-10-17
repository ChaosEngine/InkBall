using System;
using System.Collections.Generic;

namespace InkBall.Module
{
    public partial class InkBallUser
    {
        public InkBallUser()
        {
            InkBallPlayer = new HashSet<InkBallPlayer>();
        }

        public uint iId { get; set; }
        public string sUserName { get; set; }
        public string sPassword { get; set; }
        public string sPasswordSalt { get; set; }
        public string sName { get; set; }
        public string sSurname { get; set; }
        public sbyte iPrivileges { get; set; }
        public long id { get; set; }
        public string ksywa { get; set; }
        public string poczta { get; set; }
        public string haslo { get; set; }
        public int potwierdzenie { get; set; }

        public ICollection<InkBallPlayer> InkBallPlayer { get; set; }
    }
}
