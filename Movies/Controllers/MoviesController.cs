using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Xml;
using Movies.Models;
using Newtonsoft.Json.Linq;
using System.Data;

namespace Movies.Controllers
{
    public class MoviesController : Controller
    {
        public ActionResult Movies()
        {
            //ServicePointManager.Expect100Continue = true;
            //ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls |
            //                       SecurityProtocolType.Tls11 |
            //                       SecurityProtocolType.Tls12;
            //string strURLpath = (ConfigurationManager.AppSettings.AllKeys.Contains("API_URL") && ConfigurationManager.AppSettings["API_URL"] != null &&
            //    ConfigurationManager.AppSettings["API_URL"] != "") ? ConfigurationManager.AppSettings["API_URL"].ToString() : "";
            //string strApikey = (ConfigurationManager.AppSettings.AllKeys.Contains("APIKEY") && ConfigurationManager.AppSettings["APIKEY"] != null &&
            //    ConfigurationManager.AppSettings["APIKEY"] != "") ? ConfigurationManager.AppSettings["APIKEY"].ToString() : "";
            //string strFinalUrl = strURLpath + "movie/" + "737568" + "/" + "watch/providers" + "?api_key=" + strApikey;
            //StringBuilder strResBuild = new StringBuilder();
            //Status Status = new Status();
            //var clientat = new RestClient(strFinalUrl);
            //var requestat = new RestRequest(Method.GET);
            //requestat.AddHeader("postman-token", "52f1f9ce-41f0-ab62-655d-5613684b9e1a");
            //requestat.AddHeader("cache-control", "no-cache");
            //IRestResponse responseat = clientat.Execute(requestat);

            //string strFinalResponse = responseat.Content.ToString();
            //string strStatusCode = responseat.StatusCode.ToString();
            //  if (strStatusCode != null && strStatusCode != "" && strStatusCode.ToString().Trim().ToUpper() == "OK")
            //  {
            //      #region watch/providers
            //      var Providers = JObject.Parse(strFinalResponse)["results"].ToArray();
            //      var  str = Providers[0].Select(p=>p["rent"]).ToList();
            //      if (Providers != null && Providers.Length > 0)
            //      {
            //          strResBuild.Append("<h3>Watch / Providers</h3>");
            //          for (int k = 0; k < Providers.Length; k++)
            //          {
            //              var MultiProviders = Providers[k].Select(p => p["rent"]).ToList();
            //              strResBuild.Append("<li> Country Code:" + Providers[k]["link"].ToString().Split('=')[1].ToString().Trim().ToUpper() + "</li>");
            //              if (MultiProviders != null && MultiProviders.Count > 0)
            //              {
            //                  string strRent = string.Empty;
            //                  for (int s = 0; s < MultiProviders.Count; s++)
            //                  {
            //                      strRent += MultiProviders[s]["provider_name"].ToString().Trim() + ",";
            //                  }
            //                  strResBuild.Append("<p>  Provider Names/Rent:" +((strRent != null && strRent!="")?strRent.TrimEnd(','):"N/A" )+ "</p>");
            //              }
            //          }
            //          Status = new Status()
            //          {
            //              ResultCode = "1",
            //              ErrorMessage = strResBuild.ToString()
            //          };
            //      }
            //        #endregion
                
            //  }
           
                   return View();
        }
        public ActionResult MoviesDetails(string MovieName)
        {
            SearchMoview _Res = new SearchMoview();
            Status Status = new Status();
            List<string> MoviesList = new List<string>();
            try
            {
                ServicePointManager.Expect100Continue = true;
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls |
                                       SecurityProtocolType.Tls11 |
                                       SecurityProtocolType.Tls12;
                string strURLpath = (ConfigurationManager.AppSettings.AllKeys.Contains("API_URL") && ConfigurationManager.AppSettings["API_URL"] != null &&
                   ConfigurationManager.AppSettings["API_URL"] != "") ? ConfigurationManager.AppSettings["API_URL"].ToString() : "";
                string strApikey = (ConfigurationManager.AppSettings.AllKeys.Contains("APIKEY") && ConfigurationManager.AppSettings["APIKEY"] != null &&
                    ConfigurationManager.AppSettings["APIKEY"] != "") ? ConfigurationManager.AppSettings["APIKEY"].ToString() : "";
                string strQuery = strURLpath + "search/movie?api_key=" + strApikey + "&query=" + MovieName;
                var client = new RestClient(strQuery);
                var request = new RestRequest(Method.GET);
                request.AddHeader("postman-token", "93a4e208-0fbc-c9ee-8466-22e248f1f3c0");
                request.AddHeader("cache-control", "no-cache");
                IRestResponse response = client.Execute(request);

                if (response != null && response.Content != "")
                {
                    if (response.StatusCode.ToString().Trim().ToUpper() == "OK")
                    {
                        string strRes = response.Content.ToString();
                        JObject Object = JObject.Parse(strRes);
                        JArray Results = (JArray)Object["results"];
                        if (Results != null && Results.Count > 0)
                        {
                            string[] strDistinctMovie = new string[] { MovieName };
                            var RefMoviesList = Results.ToList().Select(p => p["title"].ToString().Trim()).ToList().Distinct().ToList();
                            MoviesList = Results.ToList().Select(p => p["title"].ToString().Trim() + "|" + p["id"].ToString().Trim()).ToList().Distinct().ToList();
                            if (strDistinctMovie.Intersect(RefMoviesList.ToArray()).Any())
                            {
                                var MovieID = Results.ToList().Where(p => p["title"].ToString().Trim().ToUpper() == MovieName.ToString().Trim().ToUpper())
                                    .Select(p =>p["id"].ToString().Trim()).ToList().Distinct().ToList().FirstOrDefault();
                                var MoviesList1 = Results.ToList().Where(p => p["title"].ToString().Trim().ToUpper() == MovieName.ToString().Trim().ToUpper())
                                    .Select(p => p["title"].ToString().Trim() + "|" + MovieID.ToString().Trim()).ToList().Distinct().ToList();
                                MoviesList = MoviesList1;
                            }
                            Status = new Status()
                            {
                                ResultCode = "1",
                                ErrorMessage = "Success"
                            };
                            _Res = new SearchMoview()
                            {
                                MoviesList = MoviesList,
                                Status = Status
                            };
                        }
                        else
                        {
                            Status = new Status()
                            {
                                ResultCode = "0",
                                ErrorMessage = "No Movies Found."
                            };
                            _Res = new SearchMoview()
                            {
                                MoviesList = MoviesList,
                                Status = Status
                            };
                        }
                    }
                }
                else
                {
                    Status = new Status()
                    {
                        ResultCode = "0",
                        ErrorMessage = "No Movies Found."
                    };
                    _Res = new SearchMoview()
                    {
                        MoviesList = MoviesList,
                        Status = Status
                    };
                }
            }
            catch (Exception ex)
            {
                Status = new Status()
                {
                    ResultCode = "0",
                    ErrorMessage = "Unable to process your request."
                };
                _Res = new SearchMoview()
                {
                    MoviesList = MoviesList,
                    Status = Status
                };

            }
            return Json(new { Result = _Res });
        }

        public ActionResult AccessingDetails(string MovieID,string Type)
        {
            Status Status = new Status();
            List<string> MoviesList = new List<string>();
            StringBuilder strResBuild = new StringBuilder();
            string strFinalResponse = string.Empty;
            string strStatusCode = string.Empty;
            
            try
            {
                ServicePointManager.Expect100Continue = true;
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls |
                                       SecurityProtocolType.Tls11 |
                                       SecurityProtocolType.Tls12;
                string strURLpath =(ConfigurationManager.AppSettings.AllKeys.Contains("API_URL")&& ConfigurationManager.AppSettings["API_URL"]!=null&&
                    ConfigurationManager.AppSettings["API_URL"]!="")? ConfigurationManager.AppSettings["API_URL"].ToString():"";
                string strApikey = (ConfigurationManager.AppSettings.AllKeys.Contains("APIKEY") && ConfigurationManager.AppSettings["APIKEY"] != null &&
                    ConfigurationManager.AppSettings["APIKEY"] != "") ? ConfigurationManager.AppSettings["APIKEY"].ToString() : "";
                string strQuery = string.Empty;
                string strAdditionalFeatures = (ConfigurationManager.AppSettings.AllKeys.Contains("AdditionalFeatures") && ConfigurationManager.AppSettings["AdditionalFeatures"] != null &&
                    ConfigurationManager.AppSettings["AdditionalFeatures"] != "") ? ConfigurationManager.AppSettings["AdditionalFeatures"].ToString() : "";
                if (strAdditionalFeatures != null && strAdditionalFeatures != "" &&
                    strAdditionalFeatures.Split(',').Contains(Type))
                {
                    #region Additional
                    string strFinalUrl=strURLpath + "movie/" + MovieID/*"737568"*/+ "/" + Type + "?api_key=" + strApikey;
                    switch (Type)
                    {
                        case "reviews":
                            #region reviews
                            strQuery = strFinalUrl; 
                            var client = new RestClient(strQuery);
                            var request = new RestRequest(Method.GET);
                            request.AddHeader("postman-token", "3a9006ed-83ec-3f21-4600-10c09e773c5a");
                            request.AddHeader("cache-control", "no-cache");
                            IRestResponse response = client.Execute(request);
                            strFinalResponse = response.Content.ToString();
                            strStatusCode = response.StatusCode.ToString();
                            if (strStatusCode != null && strStatusCode != "" && strStatusCode.ToString().Trim().ToUpper() == "OK")
                            {
                                var Object = JObject.Parse(strFinalResponse);
                                JArray reviews = (JArray)Object["results"];
                                if (reviews != null && reviews.Count > 0)
                                {
                                    strResBuild.Append("<h3>Reviews</h3>");
                                    for (int k = 0; k < reviews.Count; k++)
                                    {
                                        strResBuild.Append("<p>" + reviews[k]["content"].ToString() + "</p>");
                                        strResBuild.Append("</br>");
                                    }
                                    Status = new Status()
                                    {
                                        ResultCode = "1",
                                        ErrorMessage = strResBuild.ToString()
                                    };
                                }
                            }
                            else
                            {
                                Status = new Status()
                                {
                                    ResultCode="0",
                                    ErrorMessage="No Reviews Found"
                                };
                            }
                        #endregion 
                            break;
                        case "rating":
                            #region rating
                            strQuery = strFinalUrl;
                            var clientrating = new RestClient(strQuery);
                            var requestrating = new RestRequest(Method.GET);
                            requestrating.AddHeader("postman-token", "3a9006ed-83ec-3f21-4600-10c09e773c5a");
                            requestrating.AddHeader("cache-control", "no-cache");
                            IRestResponse responserating = clientrating.Execute(requestrating);
                            strFinalResponse = responserating.Content.ToString();
                            strStatusCode = responserating.StatusCode.ToString();
                            if (strStatusCode != null && strStatusCode != "" && strStatusCode.ToString().Trim().ToUpper() == "OK")
                            {
                                var Object = JObject.Parse(strFinalResponse);
                                JArray reviews = (JArray)Object["results"];
                                if (reviews != null && reviews.Count > 0)
                                {
                                    strResBuild.Append("<h3>Rating : " + reviews[0]["author_details"]["rating"] + "</h3>");
                                    Status = new Status()
                                    {
                                        ResultCode = "1",
                                        ErrorMessage = strResBuild.ToString()
                                    };
                                }
                            }
                            else
                            {
                                Status = new Status()
                                {
                                    ResultCode = "0",
                                    ErrorMessage = "No Rating Found"
                                };
                            }
                            #endregion 
                            break;
                        case "release_dates":
                            #region  release_dates
                            strQuery = strFinalUrl;
                            var clientrd = new RestClient(strQuery);
                            var requestrd = new RestRequest(Method.GET);
                            requestrd.AddHeader("postman-token", "5aaf0b9c-f7f6-8c58-63c6-a133a1e1dc04");
                            requestrd.AddHeader("cache-control", "no-cache");
                            IRestResponse responserd = clientrd.Execute(requestrd);
                            strFinalResponse = responserd.Content.ToString();
                            strStatusCode = responserd.StatusCode.ToString();
                            if (strStatusCode != null && strStatusCode != "" && strStatusCode.ToString().Trim().ToUpper() == "OK")
                            {
                                #region Release Dates
                                var Object = JObject.Parse(strFinalResponse);
                                var ReleaseDates = JObject.Parse(strFinalResponse)["results"].Select(p => p["release_dates"]).ToList();
                                JArray Release_Dates = (JArray)Object["results"];
                                if (Release_Dates != null && Release_Dates.Count > 0)
                                {
                                    strResBuild.Append("<h3>Release Dates</h3>");
                                    strResBuild.Append("<table class='table table-bordered'><tr><th>Country Code</th><th>Release Date</th><th>Certification</th></tr>");

                                    for (int k = 0; k < Release_Dates.Count; k++)
                                    {
                                        var strRlsDArr = ReleaseDates[k].ToArray();//.ToString();
                                        strResBuild.Append("<tr>");
                                        strResBuild.Append("<td>" + Release_Dates[k]["iso_3166_1"].ToString() + "</td>");
                                        strResBuild.Append("<td>" + strRlsDArr[0]["release_date"].ToString() + "</td>");
                                        strResBuild.Append("<td>" + strRlsDArr[0]["certification"].ToString() + "</td>");
                                        strResBuild.Append("</tr>");

                                    }
                                    strResBuild.Append("</table>");
                                    Status = new Status()
                                    {
                                        ResultCode = "1",
                                        ErrorMessage = strResBuild.ToString()
                                    };
                                }
                                #endregion
                            }
                            else
                            {
                                Status = new Status()
                                {
                                    ResultCode = "0",
                                    ErrorMessage = "No Release Dates Found."
                                };
                            }
                            #endregion 
                            break;

                        case "alternative_titles":
                          #region alternative_titles
                            strQuery = strFinalUrl;
                            var clientat = new RestClient(strQuery);
                            var requestat = new RestRequest(Method.GET);
                            requestat.AddHeader("postman-token", "52f1f9ce-41f0-ab62-655d-5613684b9e1a");
                            requestat.AddHeader("cache-control", "no-cache");
                            IRestResponse responseat = clientat.Execute(requestat);
                            strFinalResponse = responseat.Content.ToString();
                            strStatusCode = responseat.StatusCode.ToString();
                            if (strStatusCode != null && strStatusCode != "" && strStatusCode.ToString().Trim().ToUpper() == "OK")
                            {
                                #region Alternative Titles
                                var Object = JObject.Parse(strFinalResponse);
                                JArray Titles = (JArray)Object["titles"];
                                if (Titles != null && Titles.Count > 0)
                                {
                                    strResBuild.Append("<h3>Alternative Titles</h3>");
                                    for (int k = 0; k < Titles.Count; k++)
                                    {
                                        strResBuild.Append("<li>" + Titles[k]["title"].ToString() + "</li>");
                                    }

                                    Status = new Status()
                                    {
                                        ResultCode = "1",
                                        ErrorMessage = strResBuild.ToString()
                                    };
                                }
                                #endregion
                            }
                            else
                            {
                                Status = new Status()
                                {
                                    ResultCode = "0",
                                    ErrorMessage = "No Titles Found."
                                };
                            }
                       #endregion
                            break;
                        case "translations":
                            #region translations
                            strQuery = strFinalUrl;
                           var clienttran = new RestClient(strQuery);
                           var requesttran = new RestRequest(Method.GET);
                           requesttran.AddHeader("postman-token", "b92ec9af-9dc0-b43d-c45d-10f9dc845e05");
                           requesttran.AddHeader("cache-control", "no-cache");
                           IRestResponse responsetran = clienttran.Execute(requesttran);
                           strFinalResponse = responsetran.Content.ToString();
                           strStatusCode = responsetran.StatusCode.ToString();
                           if (strStatusCode != null && strStatusCode != "" && strStatusCode.ToString().Trim().ToUpper() == "OK")
                           {
                               #region Translations
                               var Object = JObject.Parse(strFinalResponse);
                               JArray Translations = (JArray)Object["translations"];
                               if (Translations != null && Translations.Count > 0)
                               {
                                   strResBuild.Append("<h3>Translations</h3>");
                                   for (int k = 0; k < Translations.Count; k++)
                                   {
                                       strResBuild.Append("<li>" + Translations[k]["english_name"].ToString() + "</li>");
                                   }
                                   Status = new Status()
                                   {
                                       ResultCode = "1",
                                       ErrorMessage = strResBuild.ToString()
                                   };
                               }
                               #endregion

                           }
                           else
                           {
                               Status = new Status()
                               {
                                   ResultCode = "0",
                                   ErrorMessage = "Translation Languages Not Found."
                               };
                           }
                          #endregion 
                           break;
                        case "watch/providers":
                           strQuery = strFinalUrl;
                           var clientwp = new RestClient(strQuery);
                           var requestwp = new RestRequest(Method.GET);
                           requestwp.AddHeader("postman-token", "19cd51aa-5a33-ef5b-2ffa-95750c3f4da7");
                           requestwp.AddHeader("cache-control", "no-cache");
                           IRestResponse responsewp = clientwp.Execute(requestwp);
                           strFinalResponse = responsewp.Content.ToString();
                           strStatusCode = responsewp.StatusCode.ToString();
                           break;
                        default:
                           break;
                    }
                    #endregion 
                }
                else
                {
                    #region ALL
                    strQuery = strURLpath + "movie/" + MovieID/*"737568"*/ + "?api_key=" + strApikey;
                    var client = new RestClient(strQuery);
                    var request = new RestRequest(Method.GET);
                    request.AddHeader("postman-token", "6ee6227b-9409-148c-38a2-bd7393c45673");
                    request.AddHeader("cache-control", "no-cache");
                    IRestResponse response = client.Execute(request);
                    strFinalResponse = response.Content.ToString();
                    strStatusCode = response.StatusCode.ToString();
                    if (strFinalResponse != null && strFinalResponse != "")
                    {
                        var Object = JObject.Parse(strFinalResponse);
                        var values = JsonConvert.DeserializeObject<Dictionary<string, object>>(strFinalResponse);
                        if (strStatusCode.ToString().Trim().ToUpper() == "OK")
                        {
                            
                            string strProductionCompanies = string.Empty;
                            string strProductionCountries = string.Empty;
                            string strSpokenLanguages = string.Empty;
                            string strGenres = string.Empty;
                            strResBuild = new StringBuilder();
                            JArray genres = (JArray)Object["genres"];
                                JArray spoken_languages = (JArray)Object["spoken_languages"];
                                JArray production_companies = (JArray)Object["production_companies"];
                                JArray production_countries = (JArray)Object["production_countries"];
                                if (genres != null && genres.Count > 0)
                                {
                                    for (int k = 0; k < genres.Count; k++)
                                    {
                                        strGenres += genres[k]["name"].ToString() + ",";
                                    }
                                }
                                if (spoken_languages != null && spoken_languages.Count > 0)
                                {
                                    for (int k = 0; k < spoken_languages.Count; k++)
                                    {
                                        strSpokenLanguages += spoken_languages[k]["name"].ToString() + ",";
                                    }
                                }
                                if (production_countries != null && production_countries.Count > 0)
                                {
                                    for (int k = 0; k < production_countries.Count; k++)
                                    {
                                        strProductionCountries += production_countries[k]["name"].ToString() + ",";
                                    }
                                }
                                if (production_companies != null && production_companies.Count > 0)
                                {
                                    strProductionCompanies = "<table class='table table-bordered'>";
                                    strProductionCompanies += "<tr>";
                                    strProductionCompanies += "<th>ID</th><th>Name</th><th>Country</th>";
                                    strProductionCompanies += "</tr>";
                                    for (int k = 0; k < production_companies.Count; k++)
                                    {
                                        strProductionCompanies += "<tr>";
                                        strProductionCompanies += "<td>" + production_companies[k]["id"].ToString() + "</td>";
                                        strProductionCompanies += "<td>" + production_companies[k]["name"].ToString() + "</td>";
                                        strProductionCompanies += "<td>" + production_companies[k]["origin_country"].ToString() + "</td>";
                                        strProductionCompanies += "</tr>";
                                    }
                                    strProductionCompanies += "</table>";
                                }
                            if (Type.ToString().Trim().ToUpper() == "ALL")
                            {
                                #region #ALL
                                strResBuild.Append("<table class='table table-bordered'>");
                                strResBuild.Append("<tr>");
                                strResBuild.Append("<th>Title</th><th>Value</th>");
                                strResBuild.Append("</tr>");
                                strResBuild.Append("<tr>");
                                strResBuild.Append("<td>Original Title</td><td>" + ((values["original_title"] != null && values["original_title"] != "") ? values["original_title"].ToString().Trim() : "N/A") + "</td>");
                                strResBuild.Append("</tr>");
                                strResBuild.Append("<tr>");
                                strResBuild.Append("<td>Popularity</td><td>" + ((values["popularity"] != null && values["popularity"] != "") ? values["popularity"].ToString().Trim() : "N/A") + "</td>");
                                strResBuild.Append("</tr>");
                                strResBuild.Append("<tr>");
                                strResBuild.Append("<td>Release Date</td><td>" + ((values["release_date"] != null && values["release_date"] != "") ?
                                    DateTime.ParseExact(values["release_date"].ToString().Trim(), "yyyy-MM-dd", System.Globalization.CultureInfo.InstalledUICulture).ToString("dd MMM yyyy") : "N/A") + "</td>");
                                strResBuild.Append("</tr>");
                                strResBuild.Append("<tr>");
                                strResBuild.Append("<td>Revenue</td><td>" + ((values["revenue"] != null && values["revenue"] != "") ? values["revenue"].ToString().Trim() : "N/A") + "</td>");
                                strResBuild.Append("</tr>");
                                strResBuild.Append("<tr>");
                                strResBuild.Append("<td>Runtime</td><td>" + ((values["runtime"] != null && values["runtime"] != "") ? values["runtime"].ToString().Trim() : "N/A") + "</td>");
                                strResBuild.Append("</tr>");
                                strResBuild.Append("<tr>");
                                strResBuild.Append("<td>Title</td><td>" + ((values["title"] != null && values["title"] != "") ? values["title"].ToString().Trim() : "N/A") + "</td>");
                                strResBuild.Append("</tr>");
                                strResBuild.Append("<tr>");
                                strResBuild.Append("<td>Status</td><td>" + ((values["status"] != null && values["status"] != "") ? values["status"].ToString().Trim() : "N/A") + "</td>");
                                strResBuild.Append("</tr>");
                                strResBuild.Append("<tr>");
                                strResBuild.Append("<td>Tagline</td><td>" + ((values["tagline"] != null && values["tagline"] != "") ? values["tagline"].ToString().Trim() : "N/A") + "</td>");
                                strResBuild.Append("</tr>");
                                strResBuild.Append("<tr>");
                                strResBuild.Append("<td>Vote Average</td><td>" + ((values["vote_average"] != null && values["vote_average"] != "") ? values["vote_average"].ToString().Trim() : "N/A") + "</td>");
                                strResBuild.Append("</tr>");
                                strResBuild.Append("<tr>");
                                strResBuild.Append("<td>Vote Count</td><td>" + ((values["vote_count"] != null && values["vote_count"] != "") ? values["vote_count"].ToString().Trim() : "N/A") + "</td>");
                                strResBuild.Append("</tr>");
                                strResBuild.Append("<tr>");
                                strResBuild.Append("<td>Production Countries</td><td>" + ((strProductionCountries != null && strProductionCountries != "") ? strProductionCountries.ToString().TrimEnd(',') : "N/A") + "</td>");
                                strResBuild.Append("</tr>");
                                strResBuild.Append("<tr>");
                                strResBuild.Append("<td>Languages</td><td>" + ((strSpokenLanguages != null && strSpokenLanguages != "") ? strSpokenLanguages.ToString().TrimEnd(',') : "N/A") + "</td>");
                                strResBuild.Append("</tr>");
                                strResBuild.Append("<tr>");
                                strResBuild.Append("<td>Genres</td><td>" + ((strGenres != null && strGenres != "") ? strGenres.ToString().TrimEnd(',') : "N/A") + "</td>");
                                strResBuild.Append("</tr>");
                                strResBuild.Append("</table>");
                                strResBuild.Append("</br>");
                                strResBuild.Append("<h3>OverView</h3>");
                                strResBuild.Append("<p>" + ((values["overview"] != null && values["overview"] != "") ? values["overview"].ToString().Trim() : "N/A") + "</p>");
                                strResBuild.Append("</br>");
                                strResBuild.Append("</br>");
                                if (strProductionCompanies != null && strProductionCompanies != "")
                                {
                                    strResBuild.Append("<h3>Production Companies</h3>");
                                    strResBuild.Append("</br>");
                                    strResBuild.Append(strProductionCompanies);
                                }
                                #endregion
                            }
                            else
                            {
                                #region Search By
                                switch (Type)
                                {
                                    case "original_title":
                                        strResBuild.Append("<h3>Original Title</h3> </br><li>" + ((values["original_title"] != null && values["original_title"] != "") ? values["original_title"].ToString().Trim() : "N/A") + "</li>");
                                        break;
                                    case "popularity":
                                        strResBuild.Append("<h3>Popularity</h3></br><li>" + ((values["popularity"] != null && values["popularity"] != "") ? values["popularity"].ToString().Trim() : "N/A") + "</li>");
                                        break;
                                    case "release_date":
                                    strResBuild.Append("<h3>Release Date</h3></br><li>" + ((values["release_date"] != null && values["release_date"] != "") ? values["release_date"].ToString().Trim() : "N/A") + "</li>");
                                        break;
                                    case "revenue":
                                        strResBuild.Append("<h3>Revenue</h3></br><li>" + ((values["revenue"] != null && values["revenue"] != "") ? values["revenue"].ToString().Trim() : "N/A") + "</li>");
                                        break;
                                    case "title":
                                        strResBuild.Append("<h3>Title</h3></br><li>" + ((values["title"] != null && values["title"] != "") ? values["title"].ToString().Trim() : "N/A") + "</li>");
                                        break;
                                    case "runtime":
                                        strResBuild.Append("<h3>Runtime</h3></br><li>" + ((values["runtime"] != null && values["runtime"] != "") ? values["runtime"].ToString().Trim() : "N/A") + "</li>");
                                        break;
                                    case "status":
                                        strResBuild.Append("<h3>Status</h3></br><li>" + ((values["status"] != null && values["status"] != "") ? values["status"].ToString().Trim() : "N/A") + "</li>");
                                        break;
                                    case"tagline":
                                        strResBuild.Append("<h3>Tagline</h3></br><li>" + ((values["tagline"] != null && values["tagline"] != "") ? values["tagline"].ToString().Trim() : "N/A") + "</li>");
                                        break;
                                    case "vote_average":
                                    strResBuild.Append("<h3>Vote Average</h3></br><li>" + ((values["vote_average"] != null && values["vote_average"] != "") ? values["vote_average"].ToString().Trim() : "N/A") + "</li>");
                                        break;
                                    case "vote_count":
                                     strResBuild.Append("<h3>Vote Count</h3></br><li>" + ((values["vote_count"] != null && values["vote_count"] != "") ? values["vote_count"].ToString().Trim() : "N/A") + "</li>");
                                        break;
                                    case "genres":
                                        strResBuild.Append("<h3>Genres</h3></br><li>" + ((strGenres != null && strGenres != "") ? strGenres  : "N/A") + "</li>");      
                                        break;
                                    case "spoken_languages":
                                        strResBuild.Append("<h3>Spoken Languages</h3></br><li>" + ((strSpokenLanguages!=null && strSpokenLanguages!="")?strSpokenLanguages:"N/A")+ "</li>"); 
                                        break;
                                    case "production_companies":
                                        if (strProductionCompanies != null && strProductionCompanies != "")
                                        {
                                            strResBuild.Append("<h3>Production Companies</h3>");
                                            strResBuild.Append("</br>");
                                            strResBuild.Append(strProductionCompanies);
                                        }
                                        else
                                        {
                                            strResBuild.Append("<p>No Records Found<p>"); 
                                        }

                                        break;
                                    case "production_countries":
                                        strResBuild.Append("<h3>Production Countries</h3></br><li>" + strProductionCountries + "</li>");
                                        break;
                                    default:
                                        break;
                                }
                                #endregion
                            }
                            Status = new Status()
                            {
                                ResultCode = "1",
                                ErrorMessage = strResBuild.ToString()
                            };
                            
                        }
                        else
                        {
                            Status = new Status()
                            {
                                ResultCode = "0",
                                ErrorMessage = "No Records Found."
                            };
                        }
                    }
                    else
                    {
                        Status = new Status()
                        {
                            ResultCode = "0",
                            ErrorMessage = "No Records Found."
                        };
                    }
                    #endregion 
                }
            }
            catch (Exception ex)
            {
                Status = new Status()
                {
                    ResultCode = "0",
                    ErrorMessage = "Unable to process your request."
                };

            }
            return Json(new { Result = Status });
        }

    }
}
