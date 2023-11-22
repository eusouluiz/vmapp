import { Injectable } from '@angular/core';
import { RESPONSAVEL_DATA } from '../../../../shared/utilities/entidade/entidade.utility';
import { Responsavel, ResponsavelInterface } from './responsavel.entity';
import { GerenciamentoRepository } from '../gerenciamento.repository';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { Aluno } from '../aluno/aluno.entity';
import { ListaUtil } from '../../../../shared/utilities/lista/lista.utility';

interface AssociacaoAlunoResponsavel {
    id?: string,
    aluno_id: string,
    responsavel_id: string,
}

@Injectable({
  providedIn: 'root',
})
export class ResponsavelService {
    
    constructor(
        private gerenciamentoRepository: GerenciamentoRepository,
        private http: HttpClient,
    ) {

    }

    buscarTodosResponsaveis(): Observable<ResponsavelInterface[]>{
        return this.http
            .get<ResponsavelInterface[]>(`${environment.api.endpoint}/responsavel`)
            .pipe(tap((responsaveis) => this.saveResponsaveisInStorage(responsaveis)));
    }
    
    buscarResponsavel(idResponsavel: string): Observable<ResponsavelInterface>{
        return this.http
            .get<ResponsavelInterface>(`${environment.api.endpoint}/responsavel/${idResponsavel}`)
            .pipe(tap((responsavel) => this.saveResponsavelInStorage(responsavel)));
    }
    
    deletarResponsavel(idResponsavel: string): Observable<ResponsavelInterface[]>{
        return this.http
            .delete<ResponsavelInterface[]>(`${environment.api.endpoint}/responsavel/${idResponsavel}`)
    }

    vincularAlunos(responsavel: Responsavel, alunos: Aluno[]){
        var listaIdAlunos: string[] = []
        responsavel.alunos.forEach((aluno) => {
            listaIdAlunos.push(aluno.aluno_id)
        })
        var listaIdAlunosNovos: string[] = []
        alunos.forEach((aluno) => {
            listaIdAlunosNovos.push(aluno.aluno_id)
        })

        const [idsNovos, idsDeletados, idsExistentes] = ListaUtil.retornarDiferencaListas(listaIdAlunosNovos, listaIdAlunos)

        idsNovos.forEach((id: string) => {
            const associacao: AssociacaoAlunoResponsavel = {
                responsavel_id: responsavel.responsavel_id,
                aluno_id: id,
            }
            this.vincularAluno(associacao).subscribe()
        })

        //TODO completar ids deletados
        // idsDeletados.forEach((id: string) => {
        //     const associacao: AssociacaoAlunoResponsavel = {
        //         responsavel_id: responsavel.responsavel_id,
        //         aluno_id: id,
        //     }
        //     this.desvincularAluno(associacao).subscribe()
        // })
    }

    vincularAluno(associacao: AssociacaoAlunoResponsavel): Observable<AssociacaoAlunoResponsavel> {
        return this.http
          .post<AssociacaoAlunoResponsavel>(`${environment.api.endpoint}/aluno-responsavel`, associacao);
    }
    
    desvincularAluno(associacao: AssociacaoAlunoResponsavel): Observable<AssociacaoAlunoResponsavel> {
        if (associacao.id !== undefined) {
            return this.http
              .delete<AssociacaoAlunoResponsavel>(`${environment.api.endpoint}/aluno-responsavel/${associacao.id}`)
        } else {
            throw new Error('id vinculo indefinido')
        }
    }

    recuperarVinculoAluno(idResponsavel: string): AssociacaoAlunoResponsavel[] {
        var listaAssociacao: AssociacaoAlunoResponsavel[] = []
        this.http
            .get<AssociacaoAlunoResponsavel[]>(`${environment.api.endpoint}/aluno-responsavel`)
            .pipe(tap((associacao) => {
                console.log(associacao)
                listaAssociacao = associacao
            })).subscribe()
        return listaAssociacao.filter((associacao) =>{
            return associacao.responsavel_id = idResponsavel
        })
    }
    
    saveResponsaveisInStorage(responsaveis: ResponsavelInterface[]) {
        this.gerenciamentoRepository.update({ responsaveis: responsaveis });
    }

    saveResponsavelInStorage(responsavel: ResponsavelInterface): void {
        var responsaveis = this.gerenciamentoRepository.responsaveis()
        const indexResponsavel = responsaveis.findIndex((r) => {
            return r.responsavel_id === responsavel.responsavel_id
        })
        responsaveis[indexResponsavel] = responsavel

        this.gerenciamentoRepository.update({ responsaveis: responsaveis });
    }
}