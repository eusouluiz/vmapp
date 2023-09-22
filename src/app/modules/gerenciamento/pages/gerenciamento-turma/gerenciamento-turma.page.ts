import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


export interface Turma {
  idTurma: Number
  nome: String,
}

var TURMA_DATA: Turma[] = [
  {
    idTurma: 0,
    nome: 'Turma A',
  },
  {
    idTurma: 1,
    nome: 'Turma B',
  },
  {
    idTurma: 2,
    nome: 'Turma C',
  },
]

@Component({
  selector: 'app-gerenciamento-turma',
  templateUrl: './gerenciamento-turma.page.html',
  styleUrls: ['./gerenciamento-turma.page.scss'],
})
export class GerenciamentoTurmaPage implements OnInit {

  turmas!: Turma[]

  constructor(
    private router: Router,
    ) { 
      this.turmas = TURMA_DATA
  }

  ngOnInit() {
  }

  public navegarDetalheTurma(turma: Turma){
    const caminho: String = '/turma/' + turma.idTurma + '/detalhes'
    this.navegarPara(caminho)
  }
  
  public navegarCadastroTurma(){
    const caminho: String = '/turma/cadastro'
    this.navegarPara(caminho)
  }

  private navegarPara(rota: String){
    if (rota.substring(0, 1) !== '/') {
      rota = '/' + rota
    }
    const caminho: String = '/app/gerenciamento' + rota
    this.router.navigate([caminho])
  }

}
