

var aryairport = "";
function Flightavailability(ary,trip) {
    debugger
    var arg = JSON.parse(ary)
    var gloary= groupingfunction(arg.Flights)
    var s="";
     aryairport=loadcityairport()
    s+='<div class="responsive-table scroll-table" style="overflow: hidden; outline: none;" tabindex="5000">';
    s+='<table class="table flight-table no-more-tables">';
    s+='<thead><tr><th style="display: none !important;"></th><th style="display:none;">AirCraft</th><th style="float:left;">Departure</th>'
    s+=' <th style="float:left;width:36%;"><span style="display:none;">Flight No</span></th> <th style="float:left;">Arrival</th> <th class="clsfarestyle hotdeal Economy">Hot Deal</th>'
    s+=' <th class="clsfarestyle supsaver Economy">Super Saver</th> <th class="clsfarestyle classtravel Economy">Economy</th><th class="clsfarestyle fareflexi Economy">Flexi </th>'
    s+=' <th class="clsfarestyle Business supsaver" style="display:none;">Business </th><th class="clsfarestyle Business fareflexi" style="display:none;">Flexi </th>'
    s+='<th style="display:none;" class="text-center">Fare Basis </th>'  
    s+='</tr> </thead>'      
    s+='<tbody>'
    var k="";
    var c="";
    var farelst = ["Hot Deal", "SUPERSAVER", "ECONOMY", "FLXI", "Business", "Businessflxi"];
    for (var i = 0; i < gloary.length; i++) {
        for (var j = 0; j < gloary[i][1].Segments[0].length; j++) {
            k= gloary[i][1].Segments[j];
            c = gloary[i][1].PaxFares[j];
            if (k.TripType == "Ob") {

            
            s += '<tr class="clsavailrow sarath">'
            s+='<td data-title="" style="display: none !important;"></td>' ///Ist td
            s+='<td data-title="AirCraft" class="td-time" style="display: none;">'//2nd td
            s+=' <div> <p>'+k.AirCraftType+'</p>  </div>'
            s+='  </td>'//2nd td end
            s+=' <td>'//3rd td start
            s+='<div class="cell-view" style="padding:36px 0;"><center><img alt="logo" class="show-MulpopFare imglogo " data-animation="pop" data-placement="auto-bottom" src="/images/maicon.png"></center></div>'
            s+='<div class="org-dessec">'
            s+='<div data-title="Departure" class="td-time" style="float: left; padding: 15px 10px; width: 40%; text-align: center;">';
            s+='<div>';
            s+='<p style="font-size: 16px;margin-bottom:0px;font-weight: 500;">'+k.DepartureTime+'</p>'
            s+='<span data-toggle="tooltip" data-placement="top" title="" data-original-title="'+aryairportfn(k.Origin)+'">'+k.Origin+'</span>'
            s+='<span class="flightnam"> 8M &nbsp;'+k.FlightNumber+'</span> '
            s+=' </div>';
            s+=' </div>'
            s+='<div class="areoplane">'
            s+=' <i class="fa fa-plane"></i>'
            s+='</div>'
            s+='<div data-title="Arrival" class="td-time" style="float: right;padding: 15px 10px; width: 40%; text-align: center;">'
            s+='<div>'
            s+=' <p style="font-size: 16px;margin-bottom:0px;font-weight:500;">'+k.ArrivalTime+'</p>'
            s+=' <span data-toggle="tooltip" data-placement="top" title="" data-original-title="'+aryairportfn(k.Destination)+'">'+k.Destination+'</span>'
            s+='   <span class="durtime"><span>'+k.Duration+'</span></span>'
            s+=' <span class="airportnam" style="display:none;">'+aryairportfn(k.Destination)+'</span>'
            s+='   </div>'
            s+='     </div>'
            s+='</div>'
          }

            if (k.TripType == "Rb")
            {
               
                s += '<div data-title="Departure" class="td-time" style="float: left; padding: 15px 10px; width: 40%; text-align: center;">';
                s += '<div>';
                s += '<p style="font-size: 16px;margin-bottom:0px;font-weight: 500;">' + k.DepartureTime + '</p>'
                s += '<span data-toggle="tooltip" data-placement="top" title="" data-original-title="' + aryairportfn(k.Origin) + '">' + k.Origin + '</span>'
                s += '<span class="flightnam"> 8M &nbsp;' + k.FlightNumber + '</span> '
                s += ' </div>';
                s += ' </div>'
                s += '<div class="areoplane">'
                s += ' <i class="fa fa-plane"></i>'
                s += '</div>'
                s += '<div data-title="Arrival" class="td-time" style="float: right;padding: 15px 10px; width: 40%; text-align: center;">'
                s += '<div>'
                s += ' <p style="font-size: 16px;margin-bottom:0px;font-weight:500;">' + k.ArrivalTime + '</p>'
                s += ' <span data-toggle="tooltip" data-placement="top" title="" data-original-title="' + aryairportfn(k.Destination) + '">' + k.Destination + '</span>'
                s += '   <span class="durtime"><span>' + k.Duration + '</span></span>'
                s += ' <span class="airportnam" style="display:none;">' + aryairportfn(k.Destination) + '</span>'
                s += '   </div>'
                s += '     </div>'
                s += '</div>'
            }


            s+='<div data-title="Flight No" class="td-time td-flightno" style="float: left;width: 100%;">'
            s+=' <div style="float: left;">'
            s+='<p style="font-weight: 600; font-size: 14px;">'
            s+='<span class="clsfontsize"><span class="stop clsfontsize">'+k.StopOver+'<span class="clsfontsize">&nbsp;stop(s)</span></span></span> </p>'
            s+='</div>'
            s+='<div class="" style="float:right">'
            s+='<a class="fltdet-show" id="Flight_div_'+i+'_'+j+'" onclick="Flightdetails(this)" href="javascript:void(0)" style="color: #0670cc; font-weight: 500;">Flight Details&nbsp;<i class="fa fa-caret-right"></i></a>'
            s+=' </div>'
            s+=' </div>'
            s+=' </td>'//3rd td end
            var value="";
            for (var t = 0; t < 6; t++) {
                value=farelst[t]
                var stylecls = value == "Business" || value == "Businessflxi" ? "display:none" : "";
                var clastxt = value == "Business" || value == "Businessflxi" ? "Business" : "Economy";
                if (k.Category == value) {
                
                 
                    s+='<td data-title="Fare Basis " class="td-price text-center col-sm-2  clsrd clssetofRBT clsfareshow Hovercls '+clastxt+'" style='+stylecls+'>'
                    s+=' <div class="clsfaredv" id="dvshow_returnFare'+i+'_'+j+'">';
                
                    s+='   <div style="display:none;">'
                    s+=' <label class="clsRBDlbl" style="cursor:pointer;" for="onwardFare1+0">E</label>'
                                                                            
                    s+='    </div>'
                    s += '<div>'
                    s+='<div class="mk-trc mk-trcA" data-style="radio" data-radius="true">'
                    s+='<input id="returnFare'+i+'_'+j+'" checked="" type="radio" class="radio clsradioOnward" name="airlineOnward" data-fulldata="'+JSON.stringify(gloary[i][1])+'" data-assigned-id="" data-selectedidonwrd="E" data-selectedfbc="" data-fare-id="" data-rbt-no="0">'
                    s += '<label style="cursor:pointer;" for="returnFare' + i + '_' + j + '"><i></i></label>'
                    s += '</div>'
                    s += '</div>'
                    s+='<input type="hidden" value="335335" id="hdnKey">  '                                                                              
                    s+='</div>'
                    s+='<div style="margin-top: 8px; font-size: 18px; font-weight: 500; color: #000;"><span>'+c.CurrencyCode+' </span> '+c.GrossFare+'</div>'
                    s += '<span class="clsseatlecft">' + k.NoOfSeats + ' Seat(s) left</span>'
                    s+='</div>'
                    s+='</td>'
                }else{
                    s+=' <td class="col-sm-2 clsfarestyle '+clastxt+'" style="'+stylecls+'"><span>N/A</span></td>'
                }
             
            }
            s += '</tr>'
                    
            s+=' <tr class="connect-details" id="Flight_detail_'+i+'_'+j+'">'
            s+=' <td colspan="5" class="" style="background: #f1f1f1;">'
            s+='     <div class="col-sm-12 details-flight-sec">'
            s+='         <div class="col-sm-4">'
            s+='             <div class="airportname">'
            s+='                  '+aryairportfn(k.Origin)+''
            s+='             </div>'
            s+='             <div class="orgin-time">'
            s+='                '+k.DepartureTime+''
            s+='             </div>'
            s+='             <div class="airlinename">'
            s+='                 <em>Mai Air</em>, 8M &nbsp;'+k.FlightNumber+''
            s+='             </div>'
            s+='         </div>'
            s+='         <div class="col-sm-2" style="padding: 0px;">'
            s+='             <div class="line-ht">'
            s+='                 <div class="left-dots">'
            s+='                 </div>'
            s+='                 <div class="right-dots"></div>'
            s+='                 <div class="flightimg">'
            s+='                     <i class="fa fa-plane"></i>'
            s+='                 </div>'
            s+='             </div>'
            s+='         </div>'
            s+='         <div class="col-sm-4 txt-align-rt">'
            s+='             <div class="airportname">'
            s+='               '+aryairportfn(k.Destination)+''
            s+='             </div>'
            s+='             <div class="des-time">'
            s+='                '+k.ArrivalTime+''
            s+='             </div>'
            s+='             <div class="dur-time">Durations:&nbsp;<span>'+k.Duration+''
        
            s+=' </span></div>'
            s+=' </div>'
            s+=' <div class="col-sm-2 bag-det">'
            s+='     <i class="fa fa-suitcase Bagglst" aria-hidden="true" id=""></i>&nbsp; '+k.AllowBaggageDetail.AdultBaggage+''
            s+=' </div>'
            s+='     </div>'
            s+='      </td>'                                          
            s+='</tr>'
   
     


        }
    }                                             

    s+='</tbody>'
    s+='<table>' 
    s += '<div>'
   $("#Flightavail").html(s);
}                                  
                                            

function groupingfunction(availres) {

    var currentValue = [];
    //var comgroupedfli = availres.reduce(function (result, current) {
    //    result[current[0].FlightNumber + "~" + current[0].DepartureTime] = result[current[0].FlightNumber + "~" + current[0].DepartureTime] || []; //For both flight Number and Departure time
    //    result[current[0].FlightNumber + "~" + current[0].DepartureTime].push(current);
    //    return result;
    //}, {});
    var comgroupedfli = availres.reduce(function (previousValue, currentValue) {

        previousValue[currentValue.Segments[0].FlightNumber] = previousValue[currentValue.Segments[0].FlightNumber] || []; //For both flight Number and Departure time
        previousValue[currentValue.Segments[0].FlightNumber].push(currentValue);
        return previousValue;
    }, {});
    var comgrouparry = [];
    for (var obj in comgroupedfli) {
        comgrouparry.push(comgroupedfli[obj]);
    }
    return comgrouparry;

}



    function loadcityairport() {
    var json = "";
    $.ajax({
        url: cityairportxml,
        dataType: 'xml',
        async: false,
        success: function (response) {

            try {
                json = $.xml2json(response);
            }
            catch (ex) {
                json = "";
            }
        }
    });
    return json;
    }

    function aryairportfn(arg){
        var filter = $.grep(aryairport.TEMP, function (u, i) {
            return u.SEG_ORIGIN_CODE == arg
        });
        return filter[0].SEG_ORIGIN;

    }