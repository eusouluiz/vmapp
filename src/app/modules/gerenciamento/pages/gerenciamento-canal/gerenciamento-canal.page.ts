import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CanalService } from '../../../../core/services/canal-service/canal.service';
import { Pagina } from '../../../../shared/utilities/pagina/pagina.utility';
import { ConstantesRotas } from '../../../../shared/utilities/constantes/constantes.utility';
import { Location } from '@angular/common';
import { Canal } from '../../../../core/services/canal-service/canal.entity';

@Component({
  selector: 'app-gerenciamento-canal',
  templateUrl: './gerenciamento-canal.page.html',
  styleUrls: ['./gerenciamento-canal.page.scss'],
})
export class GerenciamentoCanalPage extends Pagina implements OnInit {

  canais: Canal[] = []
  listaCanais: Canal[] = []


  constructor(
    private router: Router,
    private canalService: CanalService,
    public location: Location,
  ) {
    const ROTA_BASE = ConstantesRotas.ROTA_APP + ConstantesRotas.ROTA_GERENCIAMENTO
    super(router, ROTA_BASE, location)
  }

  ngOnInit() {
  }

  protected inicializarConteudo(): void {
    this.canais = this.canalService.buscarTodosCanais()
    this.listaCanais = this.canais.slice()
  }

  filtarCanalNome(ev: any) {
    var val = ev.target.value;
    this.listaCanais = this.canais.slice()

    // se o valor for um valor valido
    this.listaCanais = this.listaCanais.filter((canal) => {
      return (canal.nome.toLowerCase().indexOf(val.toLowerCase()) > -1);
    })
  }

  navegarTelaCanal(id: number) {
    var rota = ConstantesRotas.ROTA_GERENCIAMENTO_CANAL
    if (id !== -1) {
      rota = rota + ConstantesRotas.BARRA + id + ConstantesRotas.ROTA_GERENCIAMENTO_DETALHES
    } else {
      rota = rota + ConstantesRotas.ROTA_GERENCIAMENTO_CADASTRO
    }
    this.navegarPara(rota)
  }
}
