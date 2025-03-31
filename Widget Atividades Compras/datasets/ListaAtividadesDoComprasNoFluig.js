function createDataset(fields, constraints, sortFields) {
    try {
        if (constraints) {
            var [Operacao, Ano, Mes, Dia] = ExtraiConstraints(constraints);
            var myQuery = null;

            if (Operacao == "ChamadosResolvidosPorCategoria") {
                myQuery = MontaQueryChamadosResolvidosPorCategoria(Ano, Mes, Dia);
            }
            else if (Operacao == "ChamadosResolvidosPorAtendimento") {
                myQuery = MontaQuerySuporteComprasPorAtendimento(Ano, Mes, Dia);
            }
            else if (Operacao == "ChamadosResolvidosPorSolicitante") {
                myQuery = MontaQuerySuporteComprasPorSolicitante(Ano, Mes, Dia);
            }
           

            return executaQueryNoFluig(myQuery);
        }
    } catch (error) {
        log.info("Erro ao executar ListaAtividadesDaControladoria: " + error);
        var newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn("coluna");
        newDataset.addRow(["deu erro! "]);
        newDataset.addRow([error]);
    }
}

function ExtraiConstraints(constraints) {
    var Operacao = null;
    var Mes = null;
    var Ano = null;
    var Dia = null;

    for (i = 0; i < constraints.length; i++) {
        if (constraints[i].fieldName == "Operacao") {
            Operacao = constraints[i].initialValue;

        } else if (constraints[i].fieldName == "Ano") {
            Ano = constraints[i].initialValue;
        }
        else if (constraints[i].fieldName == "Mes") {
            Mes = constraints[i].initialValue;
        }
        else if (constraints[i].fieldName == "Dia") {
            Dia = constraints[i].initialValue;
        }
    }

    if (Operacao && Mes) {
        return [Operacao, Ano, Mes, Dia];
    }
    else {
        throw "Constraints não informadas.";
    }
}

function MontaQueryChamadosResolvidosPorCategoria(Ano, Mes, Dia) {
    var DataInicio = Ano + "-" + Mes;

    var DataFim = null;
    if (Mes == 12) {
        DataFim = (parseInt(Ano) + 1) + "-01";
    }
    else {
        Mes = parseInt(Mes) + 1;
        if (Mes < 10 ) {
            Mes = "0" + Mes
        }
        DataFim = Ano + "-" +Mes;
    }


    var myQuery =
      "SELECT\
            COUNT(PROCES_WORKFLOW.NUM_PROCES) as QNTD,\
            COUNT(CASE WHEN PROCES_WORKFLOW.END_DATE like '" + DataInicio + "-" + Dia + "%' THEN 1 END) as 'QNTDHOJE',\
            MLSUPORTECOMPRAS.selectMotivo\
        FROM PROCES_WORKFLOW\
            INNER JOIN ML00139978 MLSUPORTECOMPRAS ON MLSUPORTECOMPRAS.documentid = PROCES_WORKFLOW.NR_DOCUMENTO_CARD\
            INNER JOIN TAR_PROCES ON PROCES_WORKFLOW.NUM_PROCES = TAR_PROCES.NUM_PROCES AND TAR_PROCES.IDI_STATUS = 2 AND TAR_PROCES.NUM_SEQ_ESCOLHID = 6\
        WHERE\
            PROCES_WORKFLOW.END_DATE >= '" + DataInicio + "-01'\
            AND PROCES_WORKFLOW.END_DATE < '" + DataFim + "-01'\
            AND  MLSUPORTECOMPRAS.atendimento != ''\
        GROUP BY MLSUPORTECOMPRAS.selectMotivo \
        UNION \
        SELECT \
            COUNT(PROCES_WORKFLOW.NUM_PROCES) as QNTD,\
            COUNT(CASE WHEN PROCES_WORKFLOW.END_DATE like '" + DataInicio + "-" + Dia + "%' THEN 1 END) as 'QNTDHOJE',\
            MLSUPORTEFROTAS.suporte\
        FROM PROCES_WORKFLOW\
            INNER JOIN ML00155539 MLSUPORTEFROTAS ON MLSUPORTEFROTAS.documentid = PROCES_WORKFLOW.NR_DOCUMENTO_CARD\
            INNER JOIN TAR_PROCES ON PROCES_WORKFLOW.NUM_PROCES = TAR_PROCES.NUM_PROCES AND TAR_PROCES.IDI_STATUS = 2 AND TAR_PROCES.NUM_SEQ_ESCOLHID = 12\
        WHERE\
            PROCES_WORKFLOW.END_DATE >= '" + DataInicio + "-01'\
            AND PROCES_WORKFLOW.END_DATE <'" + DataFim + "-01'\
        GROUP BY MLSUPORTEFROTAS.suporte\
        ORDER BY QNTD DESC"

    return myQuery;
}
function MontaQuerySuporteComprasPorAtendimento(Ano, Mes, Dia) {
    var DataInicio = Ano + "-" + Mes;

    var DataFim = null;
    if (Mes == 12) {
        DataFim = (parseInt(Ano) + 1) + "-01";
    }
    else {
        Mes = parseInt(Mes) + 1;
        if (Mes < 10 ) {
            Mes = "0" + Mes
        }
        DataFim = Ano + "-" +Mes;
    }

    var myQuery =
      "SELECT\
            COUNT(PROCES_WORKFLOW.NUM_PROCES) as QNTD,\
            COUNT(CASE WHEN PROCES_WORKFLOW.END_DATE like '" + DataInicio + "-" + Dia + "%' THEN 1 END) as 'QNTDHOJE',\
            MLSUPORTECOMPRAS.selectMotivo,\
            MLSUPORTECOMPRAS.atendimento\
        FROM PROCES_WORKFLOW\
            INNER JOIN ML00139978 MLSUPORTECOMPRAS ON MLSUPORTECOMPRAS.documentid = PROCES_WORKFLOW.NR_DOCUMENTO_CARD\
            INNER JOIN TAR_PROCES ON PROCES_WORKFLOW.NUM_PROCES = TAR_PROCES.NUM_PROCES AND TAR_PROCES.IDI_STATUS = 2 AND TAR_PROCES.NUM_SEQ_ESCOLHID = 6\
        WHERE\
            PROCES_WORKFLOW.END_DATE >= '" + DataInicio + "-01'\
            AND PROCES_WORKFLOW.END_DATE < '" + DataFim + "-01'\
            AND MLSUPORTECOMPRAS.atendimento != ''\
        GROUP BY MLSUPORTECOMPRAS.selectMotivo, MLSUPORTECOMPRAS.atendimento\
        ORDER BY QNTD DESC";

    return myQuery;
}
function MontaQuerySuporteComprasPorSolicitante(Ano, Mes, Dia) {
    var DataInicio = Ano + "-" + Mes;

    var DataFim = null;
    if (Mes == 12) {
        DataFim = (parseInt(Ano) + 1) + "-01";
    }
    else {
        Mes = parseInt(Mes) + 1;
        if (Mes < 10 ) {
            Mes = "0" + Mes
        }
        DataFim = Ano + "-" +Mes;
    }

    var myQuery =
      "SELECT\
            COUNT(PROCES_WORKFLOW.NUM_PROCES) as QNTD,\
            COUNT(CASE WHEN PROCES_WORKFLOW.END_DATE like '" + DataInicio + "-" + Dia + "%' THEN 1 END) as 'QNTDHOJE',\
            MLSUPORTECOMPRAS.selectMotivo,\
            MLSUPORTECOMPRAS.solicitante\
        FROM PROCES_WORKFLOW\
            INNER JOIN ML00139978 MLSUPORTECOMPRAS ON MLSUPORTECOMPRAS.documentid = PROCES_WORKFLOW.NR_DOCUMENTO_CARD\
            INNER JOIN TAR_PROCES ON PROCES_WORKFLOW.NUM_PROCES = TAR_PROCES.NUM_PROCES AND TAR_PROCES.IDI_STATUS = 2 AND TAR_PROCES.NUM_SEQ_ESCOLHID = 6\
        WHERE\
            PROCES_WORKFLOW.END_DATE >= '" + DataInicio + "-01'\
            AND PROCES_WORKFLOW.END_DATE < '" + DataFim + "-01'\
            AND MLSUPORTECOMPRAS.atendimento != ''\
        GROUP BY MLSUPORTECOMPRAS.selectMotivo, MLSUPORTECOMPRAS.solicitante\
        ORDER BY QNTD DESC";

    return myQuery;
}




function executaQueryNoFluig(query) {
    var newDataset = DatasetBuilder.newDataset();
    var dataSource = "/jdbc/FluigDSRO";
    var ic = new javax.naming.InitialContext();
    var ds = ic.lookup(dataSource);
    var created = false;

    try {
        var conn = ds.getConnection();
        var stmt = conn.createStatement();
        var rs = stmt.executeQuery(query);
        var columnCount = rs.getMetaData().getColumnCount();

        while (rs.next()) {
            if (!created) {
                for (var i = 1; i <= columnCount; i++) {
                    newDataset.addColumn(rs.getMetaData().getColumnName(i));
                }
                created = true;
            }
            var Arr = new Array();
            for (var i = 1; i <= columnCount; i++) {
                var obj = rs.getObject(rs.getMetaData().getColumnName(i));
                if (null != obj) {
                    Arr[i - 1] = rs.getObject(rs.getMetaData().getColumnName(i)).toString();
                } else {
                    Arr[i - 1] = "   -   ";
                }
            }

            newDataset.addRow(Arr);
        }
    } catch (e) {
        log.error("ERRO==============> " + e.message);
        newDataset.addColumn("coluna");
        newDataset.addRow(["deu erro! "]);
        newDataset.addRow([e.message]);
        newDataset.addRow([query]);

    } finally {
        if (stmt != null) {
            stmt.close();
        }
        if (conn != null) {
            conn.close();
        }
    }

    return newDataset;
}
function executaQueryNoCastilhoCustom(query) {
    var newDataset = DatasetBuilder.newDataset();
    var dataSource = "/jdbc/CastilhoCustom";
    var ic = new javax.naming.InitialContext();
    var ds = ic.lookup(dataSource);
    var created = false;

    try {
        var conn = ds.getConnection();
        var stmt = conn.createStatement();
        var rs = stmt.executeQuery(query);
        var columnCount = rs.getMetaData().getColumnCount();

        while (rs.next()) {
            if (!created) {
                for (var i = 1; i <= columnCount; i++) {
                    newDataset.addColumn(rs.getMetaData().getColumnName(i));
                }
                created = true;
            }
            var Arr = new Array();
            for (var i = 1; i <= columnCount; i++) {
                var obj = rs.getObject(rs.getMetaData().getColumnName(i));
                if (null != obj) {
                    Arr[i - 1] = rs.getObject(rs.getMetaData().getColumnName(i)).toString();
                } else {
                    Arr[i - 1] = "   -   ";
                }
            }

            newDataset.addRow(Arr);
        }
    } catch (e) {
        log.error("ERRO==============> " + e.message);
        newDataset.addColumn("coluna");
        newDataset.addRow(["deu erro! "]);
        newDataset.addRow([e.message]);
        newDataset.addRow([query]);

    } finally {
        if (stmt != null) {
            stmt.close();
        }
        if (conn != null) {
            conn.close();
        }
    }

    return newDataset;
}