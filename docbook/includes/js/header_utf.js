<!--
	function LetMeSearch($form, $site)
	{
		var $FormContent=document.FormScope;
		inputElements.innerHTML='';
		
		if ($site=="wikipedia")
		{
			$form.action="http://www.wikipedia.org/w/wiki.phtml";
			inputElements.innerHTML += "<input type='hidden' name ='search' value='" + $FormContent.content.value + "'>";
		}
		else if ($site=="acronym")
		{
			$form.action="http://www.acronymfinder.com/af-query.asp";
			inputElements.innerHTML += "<input type='hidden' name ='Acronym' value='" + $FormContent.content.value + "'>";
			inputElements.innerHTML += "<input type='hidden' name='String' value='exact'>";
		}
		else if ($site=="sohu")
		{
			$form.action="http://search.sohu.com/cgi-bin/search.cgi";
			inputElements.innerHTML += "<input type='hidden' name ='T1' value='" + $FormContent.content.value + "'>";
		}
		else if ($site=="sina")
		{
			$form.action="http://search.sina.com.cn/cgi-bin/search/search.cgi";
			inputElements.innerHTML += "<input type='hidden' name ='_searchkey' value='" + $FormContent.content.value + "'>";
		}
		else if ($site=="beida")
		{
			$form.action="http://bingle.pku.edu.cn/scripts/ftp_search.exe";
			inputElements.innerHTML += "<input type='hidden' name ='word' value='" + $FormContent.content.value + "'>";
		}
		else if ($site=="mp3")
		{
			$form.action="http://mp3.baidu.com/m";
			inputElements.innerHTML += "<input type='hidden' name ='word' value='" + $FormContent.content.value + "'>";
			inputElements.innerHTML += "<input type='hidden' name='tn' value='baidump3'>";
			inputElements.innerHTML += "<input type='hidden' name='ct' value='134217728'>";
		}
		else if ($site=="aspseek")
		{
			$form.action="http://www.foo.bar/cgi-bin/s.cgi";
			inputElements.innerHTML += "<input type='hidden' name ='q' value='" + $FormContent.content.value + "'>";
			inputElements.innerHTML += "<input type='hidden' name='cs' value='utf-8'>";
		}
		else if ($site=="baidu")
		{
			$form.action="http://www1.baidu.com/baidu";
			if ($FormContent.scope[0].checked)
			{
				inputElements.innerHTML += "<input type='hidden' name ='word' value='" + $FormContent.content.value + " site:worldhello.net'>";
			}
			else
			{
				inputElements.innerHTML += "<input type='hidden' name ='word' value='" + $FormContent.content.value + "'>";
			}
		}
		else /* if ($site=="google") */
		{
			$form.action="http://www.google.com/custom";
			inputElements.innerHTML += "<input type='hidden' name='domains' value='worldhello.net'>";
			inputElements.innerHTML += "<input type='hidden' name='client' value='pub-7809715074708006'>";
			inputElements.innerHTML += "<input type='hidden' name='forid' value='1'>";
			inputElements.innerHTML += "<input type='hidden' name='hl' value='zh-CN'>";
			inputElements.innerHTML += "<input type='hidden' name='ie' value='UTF-8'>";
			inputElements.innerHTML += "<input type='hidden' name='oe' value='UTF-8'>";
			if ($FormContent.scope[0].checked)
			{
				inputElements.innerHTML += "<input type='hidden' name ='q' value='" + $FormContent.content.value + "'>";
				inputElements.innerHTML += "<input type='hidden' name ='sitesearch' value='worldhello.net'>";
			}
			else
			{
				inputElements.innerHTML += "<input type='hidden' name ='q' value='" + $FormContent.content.value + "'>";
				inputElements.innerHTML += "<input type='hidden' name ='sitesearch' value=''>";
			}
			for ($i=1; $i<$FormContent.scope.length; $i++)
			{
				if ($FormContent.scope[$i].checked)
				{
					inputElements.innerHTML += "<input type='hidden' name='lr' value='" + $FormContent.scope[$i].value + "'>";
					break;
				}
			}
		}

		$form.submit();
	}
	
//-->
<!--
function write_header($document_root, $logourl)
{
	if ($document_root == null || $document_root == '' )
	{
		$document_root = "/doc";
	}
	if ($logourl == null || $logourl == '' )
	{
		$logourl = $document_root + "/includes/images/logo.png";
	}

	document.write("<div class=\"navhead\">");
	document.write("<a target=\"_blank\" href=\"http://www.worldhello.net/doc/whodo_howto/\" alt=\"Whodo Howto\"><img border=\"0\" src=\"" + $logourl + "\" alt=\"Whodo Howto\"></a> | ");
	document.write("<a target=\"_blank\" href=\"http://whodo.worldhello.net/wiki/\">维客</a> | ");
	document.write("<a target=\"_blank\" href=\"http://whodo.worldhello.net/forum/\">论坛</a> | ");
	document.write("<a target=\"_blank\" href=\"http://whodo.worldhello.net/bugs/\">问题追踪</a> | ");
	document.write("<a target=\"_blank\" href=\"http://svn.worldhello.net/\">版本控制</a> | ");
	document.write("<a target=\"_blank\" href=\"http://whodo.worldhello.net/list/\">邮件列表</a> | ");
	document.write("<a target=\"_blank\" href=\"http://whodo.worldhello.net/wiki/DocBook\">DocBook</a> | ");
	document.write("<a target=\"_blank\" href=\"http://whodo.worldhello.net/wiki/FreeMind\">FreeMind</a> | ");
	document.write("<a target=\"_blank\" href=\"http://www.worldhello.net/doc/whodo_howto/\">Whodo Howto</a>");
	document.write("</div>");

	document.write("<div align='center' class=\"navhead\" >");

	document.write("<TABLE>");
	document.write("<TBODY>");
	document.write("  <TR>");
	document.write("    <TD align=\"middle\" bgcolor=\"#FFFFFF\">");
	document.write("      <TABLE width=\"100%\" align=\"center\">");
	document.write("        <TR>");
	document.write("          <FORM action=\"\" name=\"FormSearch\" target=\"_blank\" onsubmit=");
	document.write("              \"javascript: LetMeSearch(FormSearch, 'google'); return false;\">");
	document.write("            <TD class=\"star\"><span id='inputElements'>&nbsp;</span></TD>");
	document.write("            <TD align=\"right\"><INPUT type=\"button\" style=\"background-color : #EFEFEF;\"");
	document.write("            value=\"谷歌\" name=\"btnG\" onclick=");
	document.write("            \"javascript: LetMeSearch(FormSearch, 'google');\">");
	document.write("             <INPUT type=\"button\" value=\"缩略语\" style=\"background-color : #EFEFEF;\"");
	document.write("            name=\"btnA\" onclick=");
	document.write("            \"javascript: LetMeSearch(FormSearch, 'acronym');\">");
	document.write("             <INPUT type=\"button\" value=\"百度\" style=\"background-color : #EFEFEF;\"");
	document.write("            name=\"btnBaidu\" onclick=");
	document.write("            \"javascript: LetMeSearch(FormSearch, 'baidu');\">");
	document.write("             <INPUT type=\"button\" style=\"background-color : #EFEFEF;\"");
	document.write("            value=\"WIKI\" name=\"btnWiki\" onclick=");
	document.write("            \"javascript: LetMeSearch(FormSearch, 'wikipedia');\">");
	document.write("             <INPUT type=\"button\" value=\"MP3\" style=\"background-color : #EFEFEF;\"");
	document.write("            name=\"btnMP3\" onclick=");
	document.write("            \"javascript: LetMeSearch(FormSearch, 'mp3');\">");
	document.write("            </TD>");
	document.write("            ");
	document.write("          </FORM>");
	document.write("          <FORM name='FormScope' target=");
	document.write("            \"_blank\" onsubmit=\"javascript: LetMeSearch(FormSearch, 'google'); return false;\">");
	document.write("            ");
	document.write("            <TD align=\"left\"><INPUT maxlength=\"256\"");
	document.write("              size=\"30\" name='content' value=\"\"></TD>");
	document.write("            <TD align=\"right\">");
	document.write("             范围:");
	document.write("            <INPUT type=\"radio\" name=\"scope\" value=\"WorldHello\">");
	document.write("            WorldHello.net|");
	document.write("            <INPUT type=\"radio\" name=\"scope\" value=");
	document.write("            \"lang_en|lang_zh-TW|lang_zh-CN\" checked");
	document.write("            >英/中 |<INPUT type=\"radio\" name=\"scope\"");
	document.write("            value=\"lang_zh-TW|lang_zh-CN\">中");
	document.write("            |<INPUT type=\"radio\" name=\"scope\" value=");
	document.write("            \"\">All</TD>");
	document.write("            ");
	document.write("          </FORM>");
	document.write("        </TR>");
	document.write("      </TABLE>");
	document.write("    </TD>");
	document.write("  </TR>");
	document.write("</TBODY>");
	document.write("</TABLE>");

	document.write("</div>");

	document.write("<hr size=1 color='#D3D3D3'>");

	document.write("<div align='center' class=\"navhead\" >");

google_ad_client = "pub-7809715074708006";
google_alternate_color = "";
google_ad_width = 120;
google_ad_height = 60;
google_ad_format = "120x60_as_rimg";
google_cpa_choice = "CAAQ06KdzgEaCOnXets5xDAJKLHM93M";

	document.write('<div style="position:relative;top:15px;right:50px;float:right;">');
(function(){
function m(b){return b!=null?'"'+b+'"':'""'}
function B(b){if(typeof encodeURIComponent=="function"){return encodeURIComponent(b)}else{return escape(b)}}
function c(b,a){if(a){window.google_ad_url+="&"+b+"="+a}}
function g(b,a){if(a){c(b,B(a))}}
function l(b,a,d){if(a&&typeof a=="object"){a=a[d%a.length]}c("color_"+b,a)}
function D(b,a){var d=b.screen;var f=navigator.javaEnabled();var e=-a.getTimezoneOffset();if(d){c("u_h",d.height);c("u_w",d.width);c("u_ah",d.availHeight);c("u_aw",d.availWidth);c("u_cd",d.colorDepth)}c("u_tz",e);c("u_his",history.length);c("u_java",f);if(navigator.plugins){c("u_nplug",navigator.plugins.length)}if(navigator.mimeTypes){c("u_nmime",navigator.mimeTypes.length)}}
function y(b){b=b.toLowerCase();if(b.substring(0,3)!="ca-"){b="ca-"+b}return b}
function G(b,a,d){d=d.substring(0,1000);d=d.replace(/%\w?$/,"");if(b.google_ad_output=="js"&&(b.google_ad_request_done||b.google_radlink_request_done)){a.write('<script language="JavaScript1.1" src='+m(d)+"><\/script>")}else if(b.google_ad_output=="html"){if(b.name!="google_ads_frame"){a.write('<iframe name="google_ads_frame" width='+m(b.google_ad_width)+" height="+m(b.google_ad_height)+" frameborder="+m(b.google_ad_frameborder)+" src="+m(d)+' marginwidth="0" marginheight="0" vspace="0" hspace="0" allowtransparency="true" scrolling="no">'
);a.write("</iframe>")}}else if(b.google_ad_output=="textlink"){a.write('<script language="JavaScript1.1" src='+m(d)+"><\/script>")}}
function F(b){var a=null;b.google_ad_frameborder=a;b.google_ad_format=a;b.google_page_url=a;b.google_language=a;b.google_gl=a;b.google_country=a;b.google_region=a;b.google_city=a;b.google_hints=a;b.google_safe=a;b.google_encoding=a;b.google_ad_output=a;b.google_max_num_ads=a;b.google_ad_channel=a;b.google_contents=a;b.google_alternate_ad_url=a;b.google_alternate_color=a;b.google_color_bg=a;b.google_color_text=a;b.google_color_link=a;b.google_color_url=a;b.google_color_border=a;b.google_color_line=
a;b.google_adtest=a;b.google_kw_type=a;b.google_kw=a;b.google_num_radlinks=a;b.google_max_radlink_len=a;b.google_rl_filtering=a;b.google_rl_mode=a;b.google_rt=a;b.google_ad_type=a;b.google_image_size=a;b.google_feedback=a;b.google_skip=a;b.google_page_location=a;b.google_referrer_url=a;b.google_ad_region=a;b.google_ad_section=a;b.google_bid=a;b.google_cpa_choice=a;b.google_cust_age=a;b.google_cust_gender=a;b.google_cust_interests=a;b.google_cust_id=a;b.google_cust_job=a}
function A(){var b=null;var a=window;var d=document;var f=new Date;var e=f.getTime();var j=a.google_ad_format;if(a.google_cpa_choice){a.google_ad_url="http://pagead2.googlesyndication.com/cpa/ads?";a.google_ad_url+="client="+escape(y(a.google_ad_client));a.google_ad_region="_google_cpa_region_";c("cpa_choice",a.google_cpa_choice)}else{a.google_ad_url="http://pagead2.googlesyndication.com/pagead/ads?";a.google_ad_url+="client="+escape(y(a.google_ad_client))}var k=a.google_num_slots_by_client;var w=
a.google_num_slots_by_channel;var i=a.google_prev_ad_formats_by_region;a.onerror=a.google_org_error_handler;if(a.google_ad_region==b&&a.google_ad_section!=b){a.google_ad_region=a.google_ad_section}var h=a.google_ad_region==b?"":a.google_ad_region;var q=false;if(j){q=j.indexOf("_0ads")>0}if(q){if(a.google_num_0ad_slots){a.google_num_0ad_slots=a.google_num_0ad_slots+1}else{a.google_num_0ad_slots=1}if(a.google_num_0ad_slots>1){return}}else if(!a.google_cpa_choice){if(a.google_num_ad_slots){a.google_num_ad_slots=
a.google_num_ad_slots+1}else{a.google_num_ad_slots=1}if(a.google_num_slots_to_rotate){i[h]=b;if(a.google_num_slot_to_show==b){a.google_num_slot_to_show=e%a.google_num_slots_to_rotate+1}if(a.google_num_slot_to_show!=a.google_num_ad_slots){return}}else if(a.google_num_ad_slots>3&&h==""){return}}c("dt",f.getTime());c("hl",a.google_language);if(a.google_country){c("gl",a.google_country)}else{c("gl",a.google_gl)}c("gr",a.google_region);g("gcs",a.google_city);g("hints",a.google_hints);c("adsafe",a.google_safe)
;c("oe",a.google_encoding);c("lmt",a.google_last_modified_time);g("alternate_ad_url",a.google_alternate_ad_url);c("alt_color",a.google_alternate_color);c("skip",a.google_skip);var n=a.google_ad_client;if(!k[n]){k[n]=1;k.length+=1}else{k[n]+=1}if(i[h]){g("prev_fmts",i[h].toLowerCase());if(k.length>1){c("slot",k[n])}}if(j){g("format",j.toLowerCase());if(i[h]){i[h]=i[h]+","+j}else{i[h]=j}}c("num_ads",a.google_max_num_ads);c("output",a.google_ad_output);c("adtest",a.google_adtest);if(a.google_ad_channel)
{var r=a.google_ad_channel.toLowerCase();g("channel",r);var s="";var t=r.split("+");for(var o=0;o<t.length;o++){var p=t[o];if(!w[p]){w[p]=1}else{s+=p+"+"}}g("pv_ch",s)}g("url",a.google_page_url);l("bg",a.google_color_bg,e);l("text",a.google_color_text,e);l("link",a.google_color_link,e);l("url",a.google_color_url,e);l("border",a.google_color_border,e);l("line",a.google_color_line,e);c("kw_type",a.google_kw_type);g("kw",a.google_kw);g("contents",a.google_contents);c("num_radlinks",a.google_num_radlinks)
;c("max_radlink_len",a.google_max_radlink_len);c("rl_filtering",a.google_rl_filtering);c("rl_mode",a.google_rl_mode);c("rt",a.google_rt);c("ad_type",a.google_ad_type);c("image_size",a.google_image_size);c("region",a.google_ad_region);c("feedback_link",a.google_feedback);g("ref",a.google_referrer_url);g("loc",a.google_page_location);c("bid",a.google_bid);c("cust_age",a.google_cust_age);c("cust_gender",a.google_cust_gender);c("cust_interests",a.google_cust_interests);c("cust_id",a.google_cust_id);c(
"cust_job",a.google_cust_job);if(z(a,d)&&d.body){var u=d.body.scrollHeight;var v=d.body.clientHeight;if(v&&u){g("cc",Math.round(v*100/u))}}D(a,f);G(a,d,a.google_ad_url);F(a)}
function C(b,a,d){A();return true}
function z(b,a){return b.top.location==a.location}
function x(b,a){var d=a.documentElement;if(z(b,a))return false;if(b.google_ad_width&&b.google_ad_height){var f=1;var e=1;if(b.innerHeight){f=b.innerWidth;e=b.innerHeight}else if(d&&d.clientHeight){f=d.clientWidth;e=d.clientHeight}else if(a.body){f=a.body.clientWidth;e=a.body.clientHeight}if(e>2*b.google_ad_height||f>2*b.google_ad_width){return false}}return true}
function E(){var b=window;var a=document;var d=a.location;var f=a.referrer;var e=null;b.google_org_error_handler=b.onerror;b.onerror=C;if(b.google_ad_frameborder==e){b.google_ad_frameborder=0}if(b.google_ad_output==e){b.google_ad_output="html"}if(b.google_ad_format==e&&b.google_ad_output=="html"){b.google_ad_format=b.google_ad_width+"x"+b.google_ad_height}if(b.google_page_url==e){b.google_page_url=f;if(!x(b,a)){b.google_page_url=d;b.google_last_modified_time=Date.parse(a.lastModified)/1000;b.google_referrer_url=
f}}else{b.google_page_location=f;if(!x(b,a)){b.google_page_location=d}}if(b.google_num_slots_by_channel==e){b.google_num_slots_by_channel=new Array}if(b.google_num_slots_by_client==e){b.google_num_slots_by_client=new Array}if(b.google_prev_ad_formats_by_region==e){b.google_prev_ad_formats_by_region=new Array}}
E();A();

})()
	document.write('</div>');

google_ad_client = "pub-7809715074708006";
google_alternate_color = "FFFFFF";
google_ad_width = 728;
google_ad_height = 90;
google_ad_format = "728x90_as";
google_ad_type = "text_image";
google_ad_channel ="";
google_color_border = "FFFFFF";
google_color_bg = "FFFFFF";
google_color_link = "0000FF";
google_color_url = "008000";
google_color_text = "000000";

(function(){
function m(b){return b!=null?'"'+b+'"':'""'}
function B(b){if(typeof encodeURIComponent=="function"){return encodeURIComponent(b)}else{return escape(b)}}
function c(b,a){if(a){window.google_ad_url+="&"+b+"="+a}}
function g(b,a){if(a){c(b,B(a))}}
function l(b,a,d){if(a&&typeof a=="object"){a=a[d%a.length]}c("color_"+b,a)}
function D(b,a){var d=b.screen;var f=navigator.javaEnabled();var e=-a.getTimezoneOffset();if(d){c("u_h",d.height);c("u_w",d.width);c("u_ah",d.availHeight);c("u_aw",d.availWidth);c("u_cd",d.colorDepth)}c("u_tz",e);c("u_his",history.length);c("u_java",f);if(navigator.plugins){c("u_nplug",navigator.plugins.length)}if(navigator.mimeTypes){c("u_nmime",navigator.mimeTypes.length)}}
function y(b){b=b.toLowerCase();if(b.substring(0,3)!="ca-"){b="ca-"+b}return b}
function G(b,a,d){d=d.substring(0,1000);d=d.replace(/%\w?$/,"");if(b.google_ad_output=="js"&&(b.google_ad_request_done||b.google_radlink_request_done)){a.write('<script language="JavaScript1.1" src='+m(d)+"><\/script>")}else if(b.google_ad_output=="html"){if(b.name!="google_ads_frame"){a.write('<iframe name="google_ads_frame" width='+m(b.google_ad_width)+" height="+m(b.google_ad_height)+" frameborder="+m(b.google_ad_frameborder)+" src="+m(d)+' marginwidth="0" marginheight="0" vspace="0" hspace="0" allowtransparency="true" scrolling="no">'
);a.write("</iframe>")}}else if(b.google_ad_output=="textlink"){a.write('<script language="JavaScript1.1" src='+m(d)+"><\/script>")}}
function F(b){var a=null;b.google_ad_frameborder=a;b.google_ad_format=a;b.google_page_url=a;b.google_language=a;b.google_gl=a;b.google_country=a;b.google_region=a;b.google_city=a;b.google_hints=a;b.google_safe=a;b.google_encoding=a;b.google_ad_output=a;b.google_max_num_ads=a;b.google_ad_channel=a;b.google_contents=a;b.google_alternate_ad_url=a;b.google_alternate_color=a;b.google_color_bg=a;b.google_color_text=a;b.google_color_link=a;b.google_color_url=a;b.google_color_border=a;b.google_color_line=
a;b.google_adtest=a;b.google_kw_type=a;b.google_kw=a;b.google_num_radlinks=a;b.google_max_radlink_len=a;b.google_rl_filtering=a;b.google_rl_mode=a;b.google_rt=a;b.google_ad_type=a;b.google_image_size=a;b.google_feedback=a;b.google_skip=a;b.google_page_location=a;b.google_referrer_url=a;b.google_ad_region=a;b.google_ad_section=a;b.google_bid=a;b.google_cpa_choice=a;b.google_cust_age=a;b.google_cust_gender=a;b.google_cust_interests=a;b.google_cust_id=a;b.google_cust_job=a}
function A(){var b=null;var a=window;var d=document;var f=new Date;var e=f.getTime();var j=a.google_ad_format;if(a.google_cpa_choice){a.google_ad_url="http://pagead2.googlesyndication.com/cpa/ads?";a.google_ad_url+="client="+escape(y(a.google_ad_client));a.google_ad_region="_google_cpa_region_";c("cpa_choice",a.google_cpa_choice)}else{a.google_ad_url="http://pagead2.googlesyndication.com/pagead/ads?";a.google_ad_url+="client="+escape(y(a.google_ad_client))}var k=a.google_num_slots_by_client;var w=
a.google_num_slots_by_channel;var i=a.google_prev_ad_formats_by_region;a.onerror=a.google_org_error_handler;if(a.google_ad_region==b&&a.google_ad_section!=b){a.google_ad_region=a.google_ad_section}var h=a.google_ad_region==b?"":a.google_ad_region;var q=false;if(j){q=j.indexOf("_0ads")>0}if(q){if(a.google_num_0ad_slots){a.google_num_0ad_slots=a.google_num_0ad_slots+1}else{a.google_num_0ad_slots=1}if(a.google_num_0ad_slots>1){return}}else if(!a.google_cpa_choice){if(a.google_num_ad_slots){a.google_num_ad_slots=
a.google_num_ad_slots+1}else{a.google_num_ad_slots=1}if(a.google_num_slots_to_rotate){i[h]=b;if(a.google_num_slot_to_show==b){a.google_num_slot_to_show=e%a.google_num_slots_to_rotate+1}if(a.google_num_slot_to_show!=a.google_num_ad_slots){return}}else if(a.google_num_ad_slots>3&&h==""){return}}c("dt",f.getTime());c("hl",a.google_language);if(a.google_country){c("gl",a.google_country)}else{c("gl",a.google_gl)}c("gr",a.google_region);g("gcs",a.google_city);g("hints",a.google_hints);c("adsafe",a.google_safe)
;c("oe",a.google_encoding);c("lmt",a.google_last_modified_time);g("alternate_ad_url",a.google_alternate_ad_url);c("alt_color",a.google_alternate_color);c("skip",a.google_skip);var n=a.google_ad_client;if(!k[n]){k[n]=1;k.length+=1}else{k[n]+=1}if(i[h]){g("prev_fmts",i[h].toLowerCase());if(k.length>1){c("slot",k[n])}}if(j){g("format",j.toLowerCase());if(i[h]){i[h]=i[h]+","+j}else{i[h]=j}}c("num_ads",a.google_max_num_ads);c("output",a.google_ad_output);c("adtest",a.google_adtest);if(a.google_ad_channel)
{var r=a.google_ad_channel.toLowerCase();g("channel",r);var s="";var t=r.split("+");for(var o=0;o<t.length;o++){var p=t[o];if(!w[p]){w[p]=1}else{s+=p+"+"}}g("pv_ch",s)}g("url",a.google_page_url);l("bg",a.google_color_bg,e);l("text",a.google_color_text,e);l("link",a.google_color_link,e);l("url",a.google_color_url,e);l("border",a.google_color_border,e);l("line",a.google_color_line,e);c("kw_type",a.google_kw_type);g("kw",a.google_kw);g("contents",a.google_contents);c("num_radlinks",a.google_num_radlinks)
;c("max_radlink_len",a.google_max_radlink_len);c("rl_filtering",a.google_rl_filtering);c("rl_mode",a.google_rl_mode);c("rt",a.google_rt);c("ad_type",a.google_ad_type);c("image_size",a.google_image_size);c("region",a.google_ad_region);c("feedback_link",a.google_feedback);g("ref",a.google_referrer_url);g("loc",a.google_page_location);c("bid",a.google_bid);c("cust_age",a.google_cust_age);c("cust_gender",a.google_cust_gender);c("cust_interests",a.google_cust_interests);c("cust_id",a.google_cust_id);c(
"cust_job",a.google_cust_job);if(z(a,d)&&d.body){var u=d.body.scrollHeight;var v=d.body.clientHeight;if(v&&u){g("cc",Math.round(v*100/u))}}D(a,f);G(a,d,a.google_ad_url);F(a)}
function C(b,a,d){A();return true}
function z(b,a){return b.top.location==a.location}
function x(b,a){var d=a.documentElement;if(z(b,a))return false;if(b.google_ad_width&&b.google_ad_height){var f=1;var e=1;if(b.innerHeight){f=b.innerWidth;e=b.innerHeight}else if(d&&d.clientHeight){f=d.clientWidth;e=d.clientHeight}else if(a.body){f=a.body.clientWidth;e=a.body.clientHeight}if(e>2*b.google_ad_height||f>2*b.google_ad_width){return false}}return true}
function E(){var b=window;var a=document;var d=a.location;var f=a.referrer;var e=null;b.google_org_error_handler=b.onerror;b.onerror=C;if(b.google_ad_frameborder==e){b.google_ad_frameborder=0}if(b.google_ad_output==e){b.google_ad_output="html"}if(b.google_ad_format==e&&b.google_ad_output=="html"){b.google_ad_format=b.google_ad_width+"x"+b.google_ad_height}if(b.google_page_url==e){b.google_page_url=f;if(!x(b,a)){b.google_page_url=d;b.google_last_modified_time=Date.parse(a.lastModified)/1000;b.google_referrer_url=
f}}else{b.google_page_location=f;if(!x(b,a)){b.google_page_location=d}}if(b.google_num_slots_by_channel==e){b.google_num_slots_by_channel=new Array}if(b.google_num_slots_by_client==e){b.google_num_slots_by_client=new Array}if(b.google_prev_ad_formats_by_region==e){b.google_prev_ad_formats_by_region=new Array}}
E();A();

})()

	document.write("</div>");

	document.write("<hr size=1 color='#C0C0C0'>");
}
//-->
