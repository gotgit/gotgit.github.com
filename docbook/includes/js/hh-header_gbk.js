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
			inputElements.innerHTML += "<input type='hidden' name='cs' value='gb2312'>";
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
			inputElements.innerHTML += "<input type='hidden' name='ie' value='GB2312'>";
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
function write_header($logourl)
{
	if ($logourl == null || $logourl == '' )
	{
		$logourl = "logo.png";
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
	document.write("<br><hr size=1 color='#D3D3D3'>");
	document.write("</div>");

	document.write("<div align='center' class=\"navhead\" >");

	document.write("<TABLE>");
	document.write("<TBODY>");
	document.write("  <TR>");
	document.write("    <TD align=\"middle\" bgcolor=\"#EAEAEA\">");
	document.write("      <TABLE width=\"100%\" align=\"center\">");
	document.write("        <TR>");
	document.write("          <FORM action=\"\" name=\"FormSearch\" target=\"_blank\" onsubmit=");
	document.write("              \"javascript: LetMeSearch(FormSearch, 'google'); return false;\">");
	document.write("            <div id='inputElements'>&nbsp;</div>");
	document.write("          ");
	document.write("            <TD class=\"star\">&nbsp;</TD>");
	document.write("          ");
	document.write("            <TD align=\"right\"><INPUT type=\"button\"");
	document.write("            value=\"古狗\" name=\"btnG\" onclick=");
	document.write("            \"javascript: LetMeSearch(FormSearch, 'google');\">");
	document.write("            <!--INPUT type=\"button\"");
	document.write("            value=\"LAN\" name=\"btnLAN\" onclick=");
	document.write("            \"javascript: LetMeSearch(FormSearch, 'aspseek');\"-->");
	document.write("          ");
	document.write("            <INPUT type=\"button\"");
	document.write("            value=\"WIKI\" name=\"btnWiki\" onclick=");
	document.write("            \"javascript: LetMeSearch(FormSearch, 'wikipedia');\">");
	document.write("             <INPUT type=\"button\" value=\"缩略语\"");
	document.write("            name=\"btnA\" onclick=");
	document.write("            \"javascript: LetMeSearch(FormSearch, 'acronym');\">");
	document.write("             <INPUT type=\"button\" value=\"百度\"");
	document.write("            name=\"btnBaidu\" onclick=");
	document.write("            \"javascript: LetMeSearch(FormSearch, 'baidu');\">");
	document.write("             <INPUT type=\"button\" value=\"MP3\"");
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

	document.write("<hr size=1 color='#C0C0C0'>");
	document.write("</div>");
}
//-->
