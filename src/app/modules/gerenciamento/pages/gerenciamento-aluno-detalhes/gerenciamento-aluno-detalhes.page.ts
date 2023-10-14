import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ALUNO_DATA, Aluno, RESPONSAVEL_DATA, Responsavel, TURMA_DATA, Turma, alunoVazio } from '../../../../shared/utilities/entidade/entidade.utility';

@Component({
  selector: 'app-gerenciamento-aluno-detalhes',
  templateUrl: './gerenciamento-aluno-detalhes.page.html',
  styleUrls: ['./gerenciamento-aluno-detalhes.page.scss'],
})
export class GerenciamentoAlunoDetalhesPage implements OnInit {
  modo: 'cadastrar' | 'editar' | 'detalhes' = 'detalhes'

  aluno: Aluno

  form: UntypedFormGroup | undefined;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
    ) { 
      console.log(this.activatedRoute.snapshot.paramMap.get('id'))
      console.log(this.router.url.split('/').pop())

      this.definirModo()
      
      this.inicializarFormBuscaResponsavel()
      this.inicializarFormBuscaTurma()
      if (this.isModoDetalhes()) {
        var id = Number(this.activatedRoute.snapshot.paramMap.get('id'))
        this.aluno = this.resgatarAluno(id)
        this.inicializarTabelaResponsaveis()
      } else {
        this.aluno = alunoVazio()
        this.inicializarTabelaResponsaveis()
      }

      this.form = this.formBuilder.group({
        nome: [this.aluno.nome, Validators.required],
        cgm: [this.aluno.cgm, Validators.required],
      })
      if (this.isModoDetalhes()) {
        this.form.disable()
      }
  }

  ngOnInit() {
  }

  // ---- controle modo pagina ----//

  private definirModo(){
    // pega ultimo termo do endpoint
    const rota = this.router.url.split('/').pop()

    if (rota === 'cadastro') {
      this.modo = 'cadastrar'
    }
  }

  isModoDetalhes(){
    return this.modo === 'detalhes'
  }

  isModoEditar(){
    return this.modo === 'editar'
  }

  isModoCadastrar(){
    return this.modo === 'cadastrar'
  }

  // ---- define modo pagina ----//

  // ---- busca aluno ----//
  private resgatarAluno(id: Number): Aluno{
    for (let i = 0; i < ALUNO_DATA.length; i++) {
      const aluno = ALUNO_DATA[i];
      if (aluno.idAluno === id) {
        return aluno
      }
    }
    return alunoVazio()
  }
  // ---- busca aluno ----//

  
  // ---- controle botoes ----//

  eventoActions(ev:any){
    if (ev.detail.data === undefined) {
      return
    }
    const action = ev.detail.data.action
    console.log(action)

    if(action === 'delete'){
      this.deletarAluno()
    }
  }

  private deletarAluno(){
    console.log('aluno deletado')
    this.retornaPagina()
  }

  //editar
  iniciarEdicao(){
    console.log('edicao iniciada')
    console.log(this.form)
    this.modo = 'editar'
    this.form?.enable()

    this.inicializarTabelaResponsaveis()
  }

  //cancelar edicao
  cancelar(){
    console.log('cancelado')

    if (this.isModoCadastrar()) {
      this.retornaPagina()
      return
    }

    this.modo = 'detalhes'

    this.form?.setValue({
      nome: this.aluno.nome,
      cgm: this.aluno.cgm,
    })
    this.form?.disable()

    this.inicializarTabelaResponsaveis()
    this.tabelaResponsaveis.renderRows()
  }

  //salvar edicao
  salvar(){
    console.log('salvado')
    
    console.log('nome: ' + this.form?.value.nome)
    console.log('telefone: ' + this.form?.value.telefone)
    console.log('cpf: ' + this.form?.value.cpf)
    console.log('cpf: ' + this.form?.value.senha)

    this.aluno.nome = this.form?.value.nome
    this.aluno.cgm = this.form?.value.cgm

    this.atualizarResponsaveis()

    this.modo = 'detalhes'
    this.form?.disable()


  }
  // ---- controle botoes ----//

  // ---- controle responsaveis ----//

  formBuscaResponsavel!: UntypedFormGroup
  
  inicializarFormBuscaResponsavel() {
    this.formBuscaResponsavel = this.formBuilder.group({
      buscaResponsavel: ''
    })
  }

  //nome colunas
  colunasResponsavel: string[] = ['nome', 'telefone', 'acao']
  listaResponsaveisBusca: Responsavel[] = RESPONSAVEL_DATA.slice()
  nomeResponsaveisBusca: String[] = this.getNomeResponsaveisBusca(this.listaResponsaveisBusca)

  listaResponsaveisTabela!: Responsavel[]

  @ViewChild(MatTable)
  tabelaResponsaveis!: MatTable<Responsavel>;

  private inicializarTabelaResponsaveis(){
    this.listaResponsaveisTabela = this.aluno.responsaveis.slice()
    this.listaResponsaveisBusca = RESPONSAVEL_DATA.slice()
    this.nomeResponsaveisBusca = this.getNomeResponsaveisBusca(this.listaResponsaveisBusca)
    this.limparCampoBuscaResponsavel()
  }

  private getNomeResponsaveisBusca(lista: Responsavel[]): String[]{
    var nomes: String[] = []
    lista.forEach(responsavel => {
      nomes.push(responsavel.nome)
    });
    return nomes
  }

  adicionarResponsavel(valor: number){
    console.log('adicionando responsavel')
    console.log(valor)

    if (valor === -1){
      this.navegarTelaResponsavel(valor)
      return
    }
    
    const responsavel = this.listaResponsaveisBusca[valor]
    console.log(responsavel)

    this.listaResponsaveisTabela.push(responsavel)
    this.tabelaResponsaveis.renderRows()

    this.removeResponsavelDaLista(valor)
    this.limparCampoBuscaResponsavel()
  }

  limparCampoBuscaResponsavel() {
    this.formBuscaResponsavel.setValue({
      buscaResponsavel: ''
    })
  }

  private removeResponsavelDaLista(index: number){
    for (let i = 0; i < this.listaResponsaveisBusca.length; i++) {
      if (index === i){
        this.listaResponsaveisBusca.splice(index, 1)
        this.nomeResponsaveisBusca.splice(index, 1)
        break;
      }
    }
  }

  private atualizarResponsaveis(){
    this.aluno.responsaveis = this.listaResponsaveisTabela.sort((r1, r2) => {
      if (r1.nome.toLowerCase() > r2.nome.toLowerCase()){
        return 1
      } else if (r2.nome.toLowerCase() > r1.nome.toLowerCase()) {
        return -1
      } else {
        return 0
      }
    })
    this.tabelaResponsaveis.renderRows()
  }

  navegarTelaResponsavel(id: Number){
    console.log('navegar tela responsavel: ' + id)
    var rota
    if (id !== -1){
      rota = '/responsavel/' + id + '/detalhes'
    } else {
      rota = '/responsavel/cadastro'
    }
    this.navegarPara(rota) 
  }

  deletarResponsavel(id: Number){
    console.log('deletar: ' + id)
    const indexResponsavel = this.listaResponsaveisTabela.findIndex((r) => {
      return r.idResponsavel === id
    })
    if (indexResponsavel !== -1){
      this.listaResponsaveisTabela.splice(indexResponsavel, 1)
      this.tabelaResponsaveis.renderRows()
    }
  }

  // ---- controle responsaveis ----//

  // ---- controle turma ----//

  formBuscaTurma!: UntypedFormGroup
  
  inicializarFormBuscaTurma() {
    IonicModule.forRoot({scrollAssist: false})
    this.formBuscaTurma = this.formBuilder.group({
      buscaTurma: ''
    })
  }

  listaTurmasBusca: Turma[] = TURMA_DATA.slice()
  nomeTurmasBusca: String[] = this.getNomeTurmasBusca(this.listaTurmasBusca)

  private getNomeTurmasBusca(lista: Turma[]): String[]{
    var nomes: String[] = []
    lista.forEach(turma => {
      nomes.push(turma.nome)
    });
    return nomes
  }

  adicionarTurma(valor: number){
    console.log('adicionando turma')
    console.log(valor)

    if (valor === -1){
      this.navegarTelaTurma(valor)
      return
    }
    
    const turma = this.listaTurmasBusca[valor]
    console.log(turma)

    this.removeTurmaDaLista(valor)
    this.limparCampoBuscaTurma()
  }

  limparCampoBuscaTurma() {
    this.formBuscaTurma.setValue({
      buscaTurma: ''
    })
  }

  private removeTurmaDaLista(index: number){
    for (let i = 0; i < this.listaTurmasBusca.length; i++) {
      if (index === i){
        this.listaTurmasBusca.splice(index, 1)
        this.nomeTurmasBusca.splice(index, 1)
        break;
      }
    }
  }

  navegarTelaTurma(id: Number){
    console.log('cadastro de aluno')
  }

  expansao: String = '0px'

  alterarExpansao(tam: String){
    console.log(tam)
    this.expansao = tam
  }

  // ---- controle turma ----//

  private retornaPagina(){
    this.location.back()
  }
  
  private navegarPara(rota: String){
    if (rota.substring(0, 1) !== '/') {
      rota = '/' + rota
    }
    const caminho: String = '/app/gerenciamento' + rota
    this.router.navigate([caminho])
  }

}
