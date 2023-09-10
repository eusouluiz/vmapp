import { GerenciamentoResponsavelPage } from './pages/gerenciamento-responsavel/gerenciamento-responsavel.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GerenciamentoRoutingModule } from './gerenciamento-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { GerenciamentoPage } from './pages/gerenciamento/gerenciamento.page';
import { GerenciamentoAlunoPage } from './pages/gerenciamento-aluno/gerenciamento-aluno.page';
import { GerenciamentoTurmaPage } from './pages/gerenciamento-turma/gerenciamento-turma.page';
import { GerenciamentoFuncionarioPage } from './pages/gerenciamento-funcionario/gerenciamento-funcionario.page';
import { GerenciamentoCargoPage } from './pages/gerenciamento-cargo/gerenciamento-cargo.page';


@NgModule({
  declarations: [
    GerenciamentoPage, GerenciamentoResponsavelPage,
    GerenciamentoAlunoPage, GerenciamentoTurmaPage,
    GerenciamentoFuncionarioPage, GerenciamentoCargoPage,
  ],
  imports: [
    CommonModule,
    GerenciamentoRoutingModule,
    SharedModule,
    IonicModule,
  ]
})
export class GerenciamentoModule { }
