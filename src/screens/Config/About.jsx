import React, { useState, useEffect, useContext } from 'react';
import './Config.css';



const About = () => {

return(
    <div className='about-section'>
       <div className={`profile-edit-save security `}>
        <p>Sobre</p>
    </div>
    <div className='about-container'>
     <section>
        <div className='section-title'>Bem-vindo ao ArtFlow!</div>
        <div className='section-text'>No ArtFlow, acreditamos que a arte visual merece um espaço único para brilhar. Somos uma plataforma dedicada exclusivamente a artistas visuais, oferecendo um ambiente seguro e inspirador onde todos, desde iniciantes até profissionais, podem compartilhar, apreciar e se conectar por meio de suas criações. Se você cria pixel art, ilustração, modelagem 3D, pintura digital ou qualquer outra forma de expressão visual, este é o lugar ideal para você.
        </div>
     </section>
     <section>
     <div className='section-title'>Nossa Visão</div>
     <div className='section-text'>A arte visual está em constante evolução, impulsionada pela criatividade e inovação de artistas ao redor do mundo. No entanto, encontramos uma lacuna nas plataformas tradicionais, onde o foco raramente está em atender as necessidades específicas desses criadores. Nossa visão é clara: construir uma comunidade onde a arte visual é valorizada, respeitada e celebrada. Queremos ser o ponto de encontro de artistas, apreciadores e colaboradores, criando um ecossistema que promova a interação genuína e o reconhecimento do talento.</div>
     </section>
     <section>
     <div className='section-title'>Nossa Missão</div>
     <div className='section-text'>Nossa missão é fornecer as ferramentas e o ambiente ideais para que artistas visuais possam:</div>
     <div className='section-text'>Exibir e organizar suas criações de forma intuitiva e atrativa;
        Receber feedback construtivo de outros membros da comunidade;
        Descobrir novas artes e artistas em um espaço exclusivo para visuais;
        Conectar-se e colaborar com outros artistas para novos projetos e ideias.
        Queremos tornar a arte visual mais acessível, inclusiva e visível para todos. É por isso que desenvolvemos uma plataforma dedicada a amplificar as vozes e visões dos artistas visuais.</div>
     </section>
     <section>
     <div className='section-title'>Funcionalidades do ArtFlow</div>
     <div className='section-text'>O ArtFlow foi projetado com funcionalidades específicas para atender as necessidades da nossa comunidade artística:</div>
     <div className='section-text'>Perfis de Artistas Personalizáveis: Cada artista pode personalizar seu perfil para representar sua identidade única. Aqui, é possível organizar suas criações em galerias, facilitando a apresentação de portfólios e coleções temáticas.</div>
     <div className='section-text'>Upload de Obras de Arte: A plataforma permite o upload de obras em diversos formatos e estilos, desde pixel arts e ilustrações tradicionais até modelagens 3D e pinturas digitais. Nossa interface intuitiva ajuda o artista a compartilhar seu trabalho com o mínimo de esforço.</div>
     <div className='section-text'>
     Interações e Feedback: No ArtFlow, a interação com outras obras vai além das "curtidas". Os usuários podem comentar, discutir e compartilhar insights sobre cada peça, criando um ambiente colaborativo onde o feedback é valorizado.
     </div>
     <div className='section-text'>Mensagens Diretas e Networking: Sabemos que muitas colaborações surgem de conversas. Com nossa ferramenta de mensagens diretas, artistas podem se conectar facilmente, discutir projetos e explorar oportunidades de colaboração.</div>
     <div className='section-text'>Curadoria e Descoberta de Conteúdo: A plataforma oferece sugestões de conteúdo com base nos interesses de cada usuário, facilitando a descoberta de novos artistas e estilos. Além disso, organizamos exposições virtuais para destacar obras selecionadas da comunidade.</div>
     </section>
     <section>
     <div className='section-title'>Para Quem é o ArtFlow?</div>
     <div className='section-text'>O ArtFlow é projetado para artistas visuais que buscam um espaço onde suas criações sejam o foco principal. Se você é:</div>
     <div className='section-text'>Um ilustrador que deseja expor suas criações digitais;
        Um artista 3D que procura compartilhar seu portfólio com outros profissionais e apreciadores;
        Um pintor digital que quer feedback e reconhecimento para o seu trabalho;
        Um designer gráfico em busca de uma comunidade que compreenda e valorize sua visão;
        Ou um apreciador de arte visual interessado em descobrir e apoiar novos talentos...
        ... então o ArtFlow é para você!</div>
        <div className='section-text'>Nosso objetivo é acolher todos os que têm um olhar apaixonado por arte visual, promovendo uma comunidade diversificada e inclusiva.</div>
     </section>
     <section>
     <div className='section-title'>Por que Escolher o ArtFlow?</div>
     <div className='section-text'>Existem diversas plataformas de arte, mas o ArtFlow se destaca por seu foco exclusivo em artistas visuais e seu compromisso com a experiência do usuário. Ao contrário de redes sociais convencionais, aqui você não terá que competir com conteúdo irrelevante para o público artístico. No ArtFlow, a arte visual está sempre em destaque, e a nossa comunidade é composta inteiramente por pessoas que compartilham a mesma paixão pela expressão visual.</div>
     <div className='section-text'>Além disso, estamos constantemente melhorando e aprimorando o ArtFlow com base no feedback de nossos usuários, para garantir que a plataforma atenda às necessidades reais da nossa comunidade.</div>
     </section>
     <section>
     <div className='section-title'>Nossos Próximos Passos</div>
     <div className='section-text'>Estamos apenas começando! Em breve, planejamos lançar novos recursos, como:</div>
     <div className='section-text'>Exposições virtuais e competições para dar ainda mais visibilidade aos artistas;
        Ferramentas de colaboração artística para incentivar o trabalho em grupo e a co-criação;
        Eventos e workshops online para que os membros da comunidade possam aprender e crescer juntos.
        Nossa visão de longo prazo é transformar o ArtFlow em uma referência global para arte visual, onde artistas e apreciadores possam se encontrar, colaborar e inspirar uns aos outros.</div>
     </section>
     <section>
     <div className='section-title'>Junte-se ao ArtFlow</div>
     <div className='section-text'>Se você é um artista visual ou um apreciador de arte, convidamos você a se juntar a nós nesta jornada. O ArtFlow é mais do que uma plataforma; é um movimento para elevar a arte visual ao lugar de destaque que ela merece. Explore, conecte-se, e faça parte de uma comunidade que valoriza cada traço, cada pixel e cada detalhe de suas criações.</div>
     <div className='section-text'>Vamos juntos construir um espaço onde a arte visual pode florescer e transformar o mundo ao nosso redor.</div>
     <div className='section-text'>Bem-vindo ao ArtFlow – Onde a arte visual encontra o seu espaço.</div>
     </section>
    </div>
    </div>
)

}

export default About