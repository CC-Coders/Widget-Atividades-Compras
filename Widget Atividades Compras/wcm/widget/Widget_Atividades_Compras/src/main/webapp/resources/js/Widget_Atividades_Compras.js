var MyWidget = SuperWidget.extend({
    init: function() {
        init();
    }
});

function init(){
    intervalAutoRefresh = null;
    LoadingCarregandoRelatorio = FLUIGC.loading('#divListaAtividades');
    
    montaListaDeAnosNoFiltro();
    setMesEAnoParaAtual();

    ExecutaRelatorio();
    setIntevaloDeExecucaoDoRelatorio(intervalAutoRefresh);
    $("#panelFiltros .panel-body").hide();
    $("#TodasAtividades").hide();

    $("#autoRefresh").on("change", function () {
        setIntevaloDeExecucaoDoRelatorio(intervalAutoRefresh);
    });
    $("#panelFiltros .panel-heading").on("click", function () {
        $("#panelFiltros .panel-body").slideToggle();
    });
    $("#Relatorio, #MesFiltro, #AnoFiltro").on("change", function () {
        ExecutaRelatorio();
    });
    $("#btnExportarDados").on("click", function () {
        ExportarDados();
    });
}

async function ExecutaRelatorio(){
    LoadingCarregandoRelatorio.show();

    var relatorio = $("#Relatorio").val();
    $("#TodasAtividades, #AtividadesPorAtendimento").hide();

    if (relatorio == "Todas as Atividades") {
        await asyncCriaListaAtividadeContab();
        $("#TodasAtividades").show();
    }
    else if (relatorio == "Atividades por Atendimento") {
        await asyncCriaListaAtividadePorAtendimento();
        $("#AtividadesPorAtendimento").show();
    }

    LoadingCarregandoRelatorio.hide();
}

async function asyncCriaListaAtividadeContab(){
    try {
        var atividades = await promiseBuscaAtividade();
        const mostraColunaHoje =  ValidaSeMesEAnoSelecionadosSaoOsAtuais();

        var html = "";

        for (const atividade of atividades) {
            var categoria = atividade.selectMotivo;
            var quantidade = atividade.QNTD;
            var quantidadeHoje = atividade.QNTDHOJE;


            html+=
            `<tr>
                <td>${categoria}</td>
                <td>${quantidade}</td>
                ${mostraColunaHoje?`<td>${quantidadeHoje}</td>`:""}
            </tr>`;
        }

        if (mostraColunaHoje) {
            $(".ThHoje").show();
        }
        else{
            $(".ThHoje").hide();
        }
        $("#tbodyTodasAtividades").html(html);


    } catch (error) {
        
    }

    function promiseBuscaAtividade(){
        return new Promise((resolve, reject)=>{
            var mes = $("#MesFiltro").val().toString().padStart(2, "0");
            var ano = $("#AnoFiltro").val();
            var dia = new Date().getDate().toString().padStart(2, "0");

            DatasetFactory.getDataset("ListaAtividadesDoComprasNoFluig",null,[
                DatasetFactory.createConstraint("Operacao","ChamadosResolvidosPorCategoria","ChamadosResolvidosPorCategoria",ConstraintType.MUST),
                DatasetFactory.createConstraint("Ano",ano,ano,ConstraintType.MUST),
                DatasetFactory.createConstraint("Mes",mes,mes,ConstraintType.MUST),
                DatasetFactory.createConstraint("Dia",dia,dia,ConstraintType.MUST),
            ], null,{
                success:ds=>{
                    if (ds.values[0].coluna && ds.values[0].coluna.trim() == "deu erro!") {
                        console.error(ds);
                        reject(ds.values[1].coluna);
                    }else{
                        resolve(ds.values);
                    }
                },
                error:e=>{
                    console.error(e);
                    reject(e);
                }
            });
        });
    }
}
async function asyncCriaListaAtividadePorAtendimento(){
    try {
        var atividades = await promiseBuscaAtividade();
        const mostraColunaHoje =  ValidaSeMesEAnoSelecionadosSaoOsAtuais();

        var html = "";

        for (const atividade of atividades) {
            var categoria = atividade.selectMotivo;
            var quantidade = atividade.QNTD;
            var quantidadeHoje = atividade.QNTDHOJE;
            var atendimento = atividade.atendimento;

            html+=
            `<tr>
                <td>${categoria}</td>
                <td>${atendimento}</td>
                <td>${quantidade}</td>
                ${mostraColunaHoje?`<td>${quantidadeHoje}</td>`:""}
            </tr>`;
        }

        if (mostraColunaHoje) {
            $(".ThHoje").show();
        }
        else{
            $(".ThHoje").hide();
        }
        $("#tbodyAtividadesPorAtendimento").html(html);


    } catch (error) {
        
    }

    function promiseBuscaAtividade(){
        return new Promise((resolve, reject)=>{
            var mes = $("#MesFiltro").val().toString().padStart(2, "0");
            var ano = $("#AnoFiltro").val();
            var dia = new Date().getDate().toString().padStart(2, "0");

            DatasetFactory.getDataset("ListaAtividadesDoComprasNoFluig",null,[
                DatasetFactory.createConstraint("Operacao","ChamadosResolvidosPorAtendimento","ChamadosResolvidosPorAtendimento",ConstraintType.MUST),
                DatasetFactory.createConstraint("Ano",ano,ano,ConstraintType.MUST),
                DatasetFactory.createConstraint("Mes",mes,mes,ConstraintType.MUST),
                DatasetFactory.createConstraint("Dia",dia,dia,ConstraintType.MUST),
            ], null,{
                success:ds=>{
                    if (ds.values[0].coluna && ds.values[0].coluna.trim() == "deu erro!") {
                        console.error(ds);
                        reject(ds.values[1].coluna);
                    }else{
                        resolve(ds.values);
                    }
                },
                error:e=>{
                    console.error(e);
                    reject(e);
                }
            });
        });
    }
}



// Utils
function montaListaDeAnosNoFiltro(){
    const anoAtual = new Date().getFullYear();
    const menorAno = 2018;
    var html = "";

    for (let ano = anoAtual; ano >= menorAno; ano--) {
        html+=`<option value="${ano}">${ano}</option>`;
    }

    $("#AnoFiltro").html(html);
}
function setMesEAnoParaAtual() {
    var dateNow = new Date();
    $("#MesFiltro").val(dateNow.getMonth() + 1);
    $("#AnoFiltro").val(dateNow.getFullYear());
}
function ValidaSeMesEAnoSelecionadosSaoOsAtuais() {
    var Mes = $("#MesFiltro").val();
    var Ano = $("#AnoFiltro").val();
    var dateNow = new Date();

    if (parseInt(Mes) == (dateNow.getMonth() + 1) && parseInt(Ano) == dateNow.getFullYear()) {
        return true;
    }
    return false;
}
function setIntevaloDeExecucaoDoRelatorio(intervalAutoRefresh) {
    clearInterval(intervalAutoRefresh);

    if ($("#autoRefresh").val() != "Desativado") {
        intervalAutoRefresh = setInterval(() => {
            ExecutaRelatorio();
        }, $("#autoRefresh").val() * 60 * 1000);
    }
}