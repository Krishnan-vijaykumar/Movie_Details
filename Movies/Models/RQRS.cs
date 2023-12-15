using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Movies.Models
{
    public class Status
    {
        public string ResultCode { get; set; }
        public string ErrorMessage { get; set; }
    }
    public class SearchMoview
    {
        public List<string> MoviesList { get; set; }
        public Status Status { get; set; }
    }
    public class Release 
    {
        public string certification { get; set; }
        public string iso_639_1 { get; set; }
         public string note { get; set; }
        public string release_date { get; set; }
        public string type { get; set; }
    }
}