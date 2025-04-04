<div id="MyWidget_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="MyWidget.instance()">
    <script type="text/javascript" src="/webdesk/vcXMLRPC.js"></script>
    <h3>Atividades Compras</h3>

    <div class="panel panel-primary" id="panelFiltros" style="margin-bottom: 4px">
        <div class="panel-heading" style="padding: 8px 12px">
            <h3 class="panel-title">Filtros</h3>
        </div>
        <div class="panel-body" style="padding: 8px 12px">
            <div id="FiltrosData" class="row">
                <div class="col-md-6">
                    <label for="MesFiltro">Mês:</label>
                    <select name="MesFiltro" id="MesFiltro" class="form-control">
                        <option value="1">Janeiro</option>
                        <option value="2">Fevereiro</option>
                        <option value="3">Março</option>
                        <option value="4">Abril</option>
                        <option value="5">Maio</option>
                        <option value="6">Junho</option>
                        <option value="7">Julho</option>
                        <option value="8">Agosto</option>
                        <option value="9">Setembro</option>
                        <option value="10">Outubro</option>
                        <option value="11">Novembro</option>
                        <option value="12">Dezembro</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label for="AnoFiltro">Ano:</label>
                    <select name="AnoFiltro" id="AnoFiltro" class="form-control">
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                        <option value="2019">2019</option>
                        <option value="2018">2018</option>
                    </select>
                </div>
            </div>
            <br />
            <div id="FiltroRelatorio" class="row">
                <div class="col-md-12">
                    <label for="Relatorio">Relatório:</label>
                    <select name="Relatorio" id="Relatorio" class="form-control">
                        <option value="Todas as Atividades">Todas as Atividades</option>
                        <option value="Atividades por Atendimento (Suporte Compras)">Atividades por Atendimento (Suporte Compras)</option>
                        <option value="Atividades por Solicitante (Suporte Compras)">Atividades por Solicitante (Suporte Compras)</option>
                        <option value="Atividades por Atendimento (Suporte Frotas)">Atividades por Atendimento (Suporte Frotas)</option>
                        <option value="Atividades por Solicitante (Suporte Frotas)">Atividades por Solicitante (Suporte Frotas)</option>
                    </select>
                </div>
            </div>
            <br />
            <div id="divAutoRefresh" class="row">
                <div class="col-md-12">
                    <label for="autoRefresh">Auto-refresh:</label>
                    <select name="autoRefresh" id="autoRefresh" class="form-control">
                        <option value="Desativado">Desativado</option>
                        <option value="1">1 Minutos</option>
                        <option value="5" selected>5 Minutos</option>
                        <option value="10">10 Minutos</option>
                    </select>
                </div>
            </div>
            <br />
            <div id="divExportarExcel" class="row">
                <div class="col-md-12" style="text-align: right">
                    <button class="btn btn-primary" id="btnExportarDados">
                        <i class="flaticon flaticon-export icon-sm" aria-hidden="true"></i>
                        Exportar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div id="divListaAtividades" style="overflow: auto">
        <div id="TodasAtividades">
            <table class="table table-bordered table-striped table-condensed">
                <thead>
                    <tr>
                        <th>Categoria</th>
                        <th>Quantidade</th>
                        <th class="ThHoje">Hoje</th>
                    </tr>
                </thead>
                <tbody id="tbodyTodasAtividades"></tbody>
            </table>
        </div>
        <div id="AtividadesPorSolicitante">
            <table class="table table-bordered table-striped table-condensed">
                <thead>
                    <tr>
                        <th>Categoria</th>
                        <th>Solicitante</th>
                        <th>Quantidade</th>
                        <th class="ThHoje">Hoje</th>
                    </tr>
                </thead>
                <tbody id="tbodyAtividadesPorSolicitante"></tbody>
            </table>
        </div>
        <div id="AtividadesPorAtendimento">
            <table class="table table-bordered table-striped table-condensed">
                <thead>
                    <tr>
                        <th>Categoria</th>
                        <th>Atendimento</th>
                        <th>Quantidade</th>
                        <th class="ThHoje">Hoje</th>
                    </tr>
                </thead>
                <tbody id="tbodyAtividadesPorAtendimento"></tbody>
            </table>
        </div>
    </div>
</div>
