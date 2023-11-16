import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pagina } from '../../../../shared/utilities/pagina/pagina.utility';
import { FuncionarioService } from '../../../../core/services/funcionario-service/funcionario.service';
import { Location } from '@angular/common';
import { ConstantesRotas } from '../../../../shared/utilities/constantes/constantes.utility';
import { Funcionario } from '../../../../core/services/funcionario-service/funcionario.entity';

@Component({
  selector: 'app-gerenciamento-funcionario',
  templateUrl: './gerenciamento-funcionario.page.html',
  styleUrls: ['./gerenciamento-funcionario.page.scss'],
})
export class GerenciamentoFuncionarioPage extends Pagina implements OnInit {

  funcionarios: Funcionario[] = []
  listaFuncionarios: Funcionario[] = []


  constructor(
    private router: Router,
    private funcionarioService: FuncionarioService,
    public location: Location,
  ) {
    const ROTA_BASE = ConstantesRotas.ROTA_APP + ConstantesRotas.ROTA_GERENCIAMENTO
    super(router, ROTA_BASE, location)
  }

  ngOnInit() {
  }

  protected inicializarConteudo(): void {
    this.funcionarios = this.funcionarioService.buscarTodosFuncionarios()
    this.listaFuncionarios = this.funcionarios.slice()
  }

  filtarFuncionarioNome(ev: any) {
    var val = ev.target.value;
    this.listaFuncionarios = this.funcionarios.slice()

    // se o valor for um valor valido
    this.listaFuncionarios = this.listaFuncionarios.filter((funcionario) => {
      return (funcionario.usuario.nome.toLowerCase().indexOf(val.toLowerCase()) > -1);
    })
  }

  navegarTelaFuncionario(id: number) {
    var rota = ConstantesRotas.ROTA_GERENCIAMENTO_FUNCIONARIO
    if (id !== -1) {
      rota = rota + ConstantesRotas.BARRA + id + ConstantesRotas.ROTA_GERENCIAMENTO_DETALHES
    } else {
      rota = rota + ConstantesRotas.ROTA_GERENCIAMENTO_CADASTRO
    }
    this.navegarPara(rota)
  }
}
