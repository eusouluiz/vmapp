import { ModalController } from '@ionic/angular';
import { AvisoService } from './../../../../core/services/aviso-service/aviso.service';
import { Component, OnInit } from '@angular/core';
import { Pagina } from '../../../../shared/utilities/pagina/pagina.utility';
import { Router } from '@angular/router';
import { ConstantesFuncionalidades, ConstantesRotas } from '../../../../shared/utilities/constantes/constantes.utility';
import { Aviso, avisoVazio } from '../../../../shared/utilities/entidade/entidade.utility';
import { AvisoModalComponent } from '../../components/aviso-modal/aviso-modal.component';
import { UsuarioLogado } from '../../../../shared/utilities/usuario-logado/usuario-logado.utility';
import { NovoAvisoComponent } from '../../components/novo-aviso/novo-aviso.component';

@Component({
  selector: 'app-aviso',
  templateUrl: './aviso.page.html',
  styleUrls: ['./aviso.page.scss'],
})
export class AvisoPage extends Pagina implements OnInit {

  avisos: Aviso[] = []
  //continuar restricao de avisos
  idResponsavel?: number = this.usuarioLogado.getIdResponsavel()

  constructor(
    private router: Router,
    private avisoService: AvisoService,
    private modalController: ModalController,
    private usuarioLogado: UsuarioLogado,
  ) {
    const ROTA_BASE = ConstantesRotas.ROTA_APP + ConstantesRotas.ROTA_AVISO
    super(router, ROTA_BASE)

    this.inicializarConteudo()
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    console.log(this.avisos)
  }

  protected inicializarConteudo(): void {
    this.avisos = this.resgatarAvisos()
  }

  resgatarAvisos(): Aviso[] {
    return this.avisoService.buscarTodosAvisos()
  }

  async abrirModalAviso(aviso: Aviso) {
    var modal
    modal = await this.modalController.create({
      component: AvisoModalComponent,
      mode: 'md',
      cssClass: 'c-ion-modal--sheet',
      initialBreakpoint: 0.8,
      componentProps: {
        modo: 'detalhes',
        aviso: aviso,
        hasAcessoGerenciamentoAviso: this.hasAcessoGerenciamentoAviso(),
      },
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss()

    if (role === 'salvarAviso') {
      aviso.titulo = data.titulo
      aviso.texto = data.texto

      this.avisoService.alterarAviso(aviso)
    }
  }

  hasAcessoGerenciamentoAviso() {
    return this.usuarioLogado.getFuncionalidadesAcessoId()?.includes(ConstantesFuncionalidades.GERENCIAMENTO_AVISO)
  }

  async abrirModalNovoAviso() {
    const modal = await this.modalController.create({
      component: NovoAvisoComponent,
      mode: 'md',
      cssClass: 'c-ion-modal--sheet',
      initialBreakpoint: 0.95,
      componentProps: {
      },
    });

    modal.present()

    
    // var novoAviso = avisoVazio()
    // novoAviso.titulo = data.titulo
    // novoAviso.texto = data.texto

    // this.avisoService.incluirAviso(novoAviso)
  }

}
