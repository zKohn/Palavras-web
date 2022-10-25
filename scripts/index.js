const tecladoHTML = window.document.querySelectorAll('div.teclado_letra');

var numLetras = 5;
var todasPalavras = palavras5Letras;
var palavra = todasPalavras[Math.floor(Math.random()*todasPalavras.length)];
var linhaCorrente = 1;
var letraSelecionada = 1;

console.log(palavra);


/*
*           FUNÇÕES BÁSICAS 
*/

function letraSelecionadaHTML(posicao = ''){
    return window.document.querySelector(`section.palavra_corrente div.coluna${posicao || letraSelecionada}`);
}

function mudaClasse({elementoHTML, muda='add'/*add/remove*/, classe}){
    elementoHTML.classList[`${muda}`](classe);
}

function apagaLetra(){
    letraSelecionadaHTML().innerHTML = '';
    movimentaHorizontal('ArrowLeft');
}

function addLetra(letra){
    letraSelecionadaHTML().innerHTML = letra;
    movimentaHorizontal('ArrowRight');
}


/*
*           FUNÇÕES INTERMEDIÁRIAS
*/

function movimentaHorizontal(comando){

    mudaClasse({ elementoHTML: letraSelecionadaHTML(), muda: 'remove', classe: 'selecionada', })

    switch(comando){
        case 'ArrowLeft':
            letraSelecionada--;
            break;
        case 'ArrowRight':
            letraSelecionada++;
            break;
    }

    if(letraSelecionada==0) letraSelecionada=1;
    if(letraSelecionada==numLetras+1) letraSelecionada=1;

    mudaClasse({ elementoHTML: letraSelecionadaHTML(), muda: 'add', classe: 'selecionada', })
}

function movimentaVertical(){
    if(linhaCorrente == 6) return true;

    let linhaCorrenteHTML = window.document.querySelector('section.palavra_corrente');
    let proximaLinhaCorrenteHTML = window.document.querySelector(`section.palavra.linha${++linhaCorrente}`);

    mudaClasse({ elementoHTML: letraSelecionadaHTML(), muda: 'remove', classe: 'selecionada', })
    mudaClasse({ elementoHTML: linhaCorrenteHTML, muda: 'remove', classe: 'palavra_corrente', });
    mudaClasse({ elementoHTML: proximaLinhaCorrenteHTML, muda: 'add', classe: 'palavra_corrente', });
    mudaClasse({ elementoHTML: letraSelecionadaHTML(letraSelecionada=1), muda: 'add', classe: 'selecionada', });

    return false;
}

function mudaCorDaTecla(classe, letra){
    tecladoHTML.forEach((tecla, i) => { 
        if(tecla.innerText==letra)
            mudaClasse({ 'elementoHTML': tecladoHTML[i], 'muda': 'add', 'classe': classe, })
    })
}

function julgaLetras(arrayLetras){
    let palavraCerta = palavra;
    let tecladoDivHTML = tecladoHTML.innerText;
    let classe = new Array(5);

    arrayLetras.forEach((letra, indice) => { // PROCURA LETRAS CORRETAS
        if(palavraCerta[indice] == letra){ 
            classe[indice] = 'correta';
            mudaCorDaTecla(classe[indice], letra);
            palavraCerta = palavraCerta.replace(palavraCerta[indice], '-');
        }else classe[indice] = 'errada'; 
    })

    arrayLetras.forEach((letra, indice) => { // PROCURA LETRAS DESORDENADAS
        let letraHTML = document.querySelector(`section.palavra_corrente div.coluna${indice+1}`);

        if(palavraCerta.includes(letra) && classe[indice] != 'correta'){
            classe[indice] = 'desordenada';
            palavraCerta = palavraCerta.replace(palavraCerta[palavraCerta.indexOf(letra)], '-');
        }

        mudaCorDaTecla(classe[indice], letra);
        mudaClasse({ 'elementoHTML': letraHTML, 'muda': 'add', 'classe': classe[indice], })
    })
}

function verificaAcerto(palavraCorrente, foiUltimaLinha){

    if(palavraCorrente != palavra && !foiUltimaLinha) return true;

    let linhaCorrenteHTML = window.document.querySelector('section.palavra_corrente');
    mudaClasse({ elementoHTML: letraSelecionadaHTML(), muda: 'remove', classe: 'selecionada', })
    mudaClasse({ elementoHTML: linhaCorrenteHTML, muda: 'remove', classe: 'palavra_corrente', });

    let tituloHTML = window.document.querySelector('.titulo div');

    if(palavraCorrente == palavra){
        tituloHTML.innerText = 'ACERTOU! :D';
        mudaClasse({ elementoHTML: tituloHTML, muda: 'add', classe: 'good_end', });
    }
    else{ 
        tituloHTML.innerText = 'NÃO DEU! :X - ' + palavra;
        mudaClasse({ elementoHTML: tituloHTML, muda: 'add', classe: 'bad_end', });
    }

    return false;
}

/*
*           FUNÇÕES AVANÇADAS
*/

function entraChar(char){
    if(char=='ENTER') classificaPalavra();
    else if(char=='⌫'|| char=='BACKSPACE') apagaLetra();
    else addLetra(char);
}

function classificaPalavra(){
    let palavraCorrenteHTML = document.querySelector('section.palavra_corrente');
    let arrayLetras = (palavraCorrenteHTML.innerText).split('\n');
    let stringLetras = arrayLetras.toString().replaceAll(',', '');

    setTimeout(() => {
        mudaClasse({ elementoHTML: palavraCorrenteHTML, muda: 'remove', classe: 'nao_existe', });
    },400);

    if( !(todasPalavras.includes( stringLetras )) ){
        mudaClasse({ elementoHTML: palavraCorrenteHTML, muda: 'add', classe: 'nao_existe', });
        return;
    }

    julgaLetras(arrayLetras);

    verificaAcerto( stringLetras, movimentaVertical() );
}

/*
*           LISTENERS
*/

tecladoHTML.forEach((letra) => {
    letra.addEventListener('click', (EventTarget) => { entraChar(EventTarget.target.innerText) })
})

window.addEventListener('keydown', (key) => {
    if( (('abcdefghijklmnopqrstuvwxyzenterbackspace')).includes((key.key).toLowerCase()) ){
        entraChar( (key.key).toUpperCase() );
    }if( key.code=='ArrowLeft' || key.code=='ArrowRight' )
        movimentaHorizontal(key.code);
})

window.document.querySelectorAll(`section.palavra div.letra`).forEach((letra, indice) => {  
    letra.addEventListener('click', () => {
        mudaClasse({ elementoHTML: letraSelecionadaHTML(), muda: 'remove', classe: 'selecionada', })
        letraSelecionada = indice%5+1;
        mudaClasse({ elementoHTML: letraSelecionadaHTML(), muda: 'add', classe: 'selecionada', })
    })
})