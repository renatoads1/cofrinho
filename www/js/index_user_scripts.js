/*jshint browser:true */
/*global $ */(function()
{
 "use strict";
 /*
   hook up event handlers 
 */
 function register_event_handlers()
 {
	var glob_receb = 0;
	var glob_totger = 0;
	var glob_resp = 0;
	var glob_laz = 0;
	var glob_pou = 0;

	 //http://maquina.realsis.com.br/engrenagem.php
	/*AJAX BUSCA AS DIVIDAS*/
		var id = sessionStorage.getItem("g_id_user");
		 $.ajax({
			type:"POST",
			url: "http://maquina.realsis.com.br/engrenagem.php",
			dataType: "json",
			data: 'tabela=carregaGrafico&id='+id,
			success: function(msg){
					glob_receb = msg.receb;
					glob_totger = msg.totger;
					glob_resp = msg.resp;
					glob_laz = msg.laz;
					glob_pou = msg.pou;
                window.alert(glob_totger);
					
			},error:function(e){
					console.log('erro de conexão com o banco');
					//window.alert('erro de conexão com o banco');
			}
			});
	/*FIM AJAX RELATORIO*/

    //google.charts.setOnLoadCallback(drawChart);
     function drawChart() {
        var data = 
        /*recebe um asoc de dados*/ 
		google.visualization.arrayToDataTable([
        ['ESTE MÊS', 'GASTOS'],
        ['SOBRA DO SALÁRIO',glob_receb],
		['OBRIGAÇÃO',glob_resp],
		['LAZER',glob_laz],
        ['POUPANÇA',glob_pou]
        ]);

        var options = {
          title: 'MEUS GASTOS',
          pieHole: 0.4,
        };

        var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
        chart.draw(data, options);
      }
     /*google*/
	 
     /*no carregar da pagina*/
     $("#pgdespheder").click(function(){
          var id = sessionStorage.getItem("g_id_user");
		 
		 /*aqui o ajax que vai buscar as despesas*/
		 $.ajax({
			type:"POST",
			url: "http://maquina.realsis.com.br/engrenagem.php",
			dataType: "json",
			data: 'tabela=carregadespesas&id='+id,
			success: function(msg){
			$("#listacontapagtb").empty();
				$("#listacontapagtb").append("<table class='table table-inverse'><thead><tr><th>ID</th><th>NOME</th><th>VALOR</th><th>DATA DE VENCIMENTO</th><th>ESTATUS</th><th>PAGAR</th></tr></thead><tbody id='tbodylistauser'></tbody></table>");
			var i=0;
			for(i=0;i<= msg.length;i++)
				{   
                    if(msg[i].mb_cont_a_pag_estatus==0)
                        {
                            var est ="<span class='btn btn-danger'>EM ABERTO</span>"; 
                        }else{
                                                        var est ="<span class='btn btn-success'>PAGO</span>";
                        }
					$("#listacontapagtb").append("<tr><th scope='row'><label class='label label-default'>"+msg[i].mb_cont_a_pag_id+"</label></th><td><h4>"+msg[i].mb_mod_pag_nome+"</h4></td><td><h4>"+msg[i].mb_cont_a_pag_valor+"</h4></td><td><h4>"+msg[i].mb_cont_a_pag_datavenc+"</h4></td><td><h4>"+est+"</h4></td><td><p><a href='#' acao='ver' id_user='"+id+"' id_conta='"+msg[i].mb_cont_a_pag_id+"' id='btn_altstatus'><span class='glyphicon glyphicon-usd button-icon-left'></span></a></p></td></tr>");
				}
			},error:function(e){
					console.log(msg.err);
					window.alert(msg.msg);
			}
			});
           });

	 $(document).on("click","#btn_altstatus",function(){         
         var id = $(this).attr('id_user');
         var id_conta = $(this).attr('id_conta');
var dados= "tabela=pagaconta&id="+id+"&id_conta="+id_conta;
         $.ajax({
type:"POST",
url: "http://maquina.realsis.com.br/engrenagem.php",
dataType: "json",
data: dados,
success: function(msg){
                console.log(msg.err);
                window.alert(msg.msg);
      },error:function(e){
                console.log(msg.err);
                window.alert(msg.msg);
      }
    });//fim do ajax
         
         
         
     });
	 /* button  #tb_salva_despesa */
    $(document).on("click", "#btn_salva_despesa", function(evt)
    {
var id = sessionStorage.getItem("g_id_user"); 
var nome = $("#tb_mb_cont_a_pag_nome").val();
var desc = $("#tb_mb_cont_a_pag_desc").val();
var tipo_pag =$("#tb_mb_cont_a_pag_tipo_pag").val();
var parcelas=$("#tb_mb_cont_a_pag_qnt_parcelas").val();
var valor = $("#tb_valorPago").val();
var data_venc = $("#tb_mb_cont_a_pag_data_venc").val();
//var valor = valor.replace(/[\.-]/g, "");
        var dados ="id="+id+"&nome="+nome+"&desc="+desc+"&tipo_pag="+tipo_pag+"&parcelas="+parcelas+"&valor="+valor+"&data_venc="+data_venc+"&tabela=CadContAPagar";
$.ajax({
type:"POST",
url: "http://maquina.realsis.com.br/engrenagem.php",
dataType: "json",
data: dados,
success: function(msg){
                console.log(msg.err);
                window.alert(msg.msg);
      },error:function(e){
                console.log(msg.err);
                window.alert(msg.msg);
      }
    });//fim do ajax
        
    });
    
     
             /*CADASTRA NOVO USUÁRIO */
    
    
/*VERIFICA SE O USUÁRIO ESTA CADASTRADO E DA ACESSO*/

    $(document).on("click", "#btnb_entra_princ", function(evt)
    {
        var user = $("#tb_user").val();
        var senha = $("#tb_senha").val();
        if(user=='' || senha ==''){
            window.alert('Preencha os campos');
        }else{
$.ajax({
type:"POST",
url: "http://maquina.realsis.com.br/engrenagem.php",
dataType: "json",
data: 'tabela=testeapp&user='+user+'&senha='+senha,
success: function(msg){
              if(msg.mb_user_iemail == user){
                    sessionStorage.setItem('g_id_user',msg.mb_user_id);
                    var glob_id = sessionStorage.getItem('g_id_user');
                    sessionStorage.setItem('g_email_user',msg.mb_user_iemail);
                    var glob_email = sessionStorage.getItem('g_email_user');
                    window.alert('bem vindo  '+glob_email);
                    activate_subpage("#menuPrincipal"); 
              }else if(msg.erro=='0')
              
              {
        $("#tb_user").css("border"," solid 1px red").slow;
        $("#tb_senha").css("border"," solid 1px red").slow;
              }
      },error:function(e){
                window.alert('Erro ajax em index_user_scripts ln 202');
      }
    });
        }
    });

        /* SAIR DO SISTEMA */
    $(document).on("click", "#logout", function(evt)
    {
         /*SAIR DO SISTEMA */
         activate_subpage("#page_42_51"); 
         return false;
    });
    
        /* MANDA O USUÁRIO PARA A PAGINA DE CADASTRO*/
    $(document).on("click", "#btn_cadastrar", function(evt)
    {
         /*global activate_subpage */
         activate_subpage("#pg_cadastrar"); 
         return false;
    });
    
        /*GRAVA O COMPLETAR CADASTRO */
    $(document).on("click", "#btn_completa_cadastro", function(evt)
    {
var glob_id = sessionStorage.getItem('g_id_user'); 
var pess_nome = $("#tb_mb_pess_nome").val();
var pess_cpf = $("#tb_mb_pess_cpf").val();
var pess_rg = $("#tb_mb_pess_rg").val();
var pess_est_civ = $("#tb_mb_pess_est_civ").val();
var pess_dat_nasc = $("#tb_mb_pess_dat_nasc").val();
var pess_dat_cas = $("#tb_mb_pess_dat_cas").val();
var pess_profissao = $("#tb_mb_pess_profissao").val();
var dados ='tabela=compl_cad_user&pess_nome='+pess_nome+'&pess_cpf='+pess_cpf+'&pess_rg='+pess_rg+'&pess_est_civ='+pess_est_civ+'&pess_dat_nasc='+pess_dat_nasc+'&pess_dat_cas='+pess_dat_cas+'&pess_profissao='+pess_profissao+'&glob_id='+glob_id;        
$.ajax({
type:"POST",
url: "http://maquina.realsis.com.br/engrenagem.php",
dataType: "json",
data: dados,
success: function(msg){
              if(msg.err=='1'){
            window.alert('dados cadastrados');
              }else 
              {
            window.alert('erro de cadastrados');
              }
      },error:function(e){
                window.alert('ERRO DE CONEXÃO COM O SERVIDOR aaaaa');
      }
    });/*fim ajax*/
      
    });
    

        /* button  #btn_grava_recebmento */
    $(document).on("click", "#btn_grava_recebmento", function(evt)
    {
var valor = $("#tb_mb_cont_a_receb_valor").val();
var parcelas = $("#tb_mb_cont_a_receb_parcelas").val();
var descri = $("#tb_mb_cont_a_receb_descri").val();
var nome = $("#tb_mb_cont_a_receb_nome").val();
var id_user = sessionStorage.getItem("g_id_user");
var data = $("#tb_mb_cont_a_receb_data").val();
var dados = "data="+data+"&valor="+valor+"&parcelas="+parcelas+"&descri="+descri+"&nome="+nome+"&id_user="+id_user+"&tabela=inserereceita";        
$.ajax({
type:"POST",
url: "http://maquina.realsis.com.br/engrenagem.php",
dataType: "json",
data: dados,
success: function(msg){
              if(msg.err =='1'){
            window.alert('dados cadastrados');
              }else 
              {
            window.alert(msg.msg);
              }
      },error:function(e){
            window.alert(msg.msg);
      }
    });/*fim ajax*/
       
    });
    

    
        /* button  #btn_gravauser */
    
    
        /* button  #btn_gravauser */
    $(document).on("click", "#btn_gravauser", function(evt)
    {
         /*global activate_subpage */
         activate_subpage("#page_42_51"); 
         return false;
    });
    
    }
document.addEventListener("app.Ready", register_event_handlers, false);
})();

/*jquery na mao*/
