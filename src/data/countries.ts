// AUTOGENERADO por scripts/build (no editar a mano).
// Fuente: dataset de países mledoze/restcountries + población del Banco Mundial.
// Nombres, capitales y hechos culturales curados en español por el equipo de datos.
// Banderas SVG locales en public/flags/{code}.svg para funcionamiento offline.
// Nota: countries.json contiene exactamente estos mismos datos (para el validador).

export type Country = {
  code: string;         // ISO 3166-1 alpha-2, minúsculas (ej. "fr")
  name: string;         // nombre en español (ej. "Francia")
  officialName?: string;
  continent: string;    // ej. "Europa"
  region?: string;      // subregión (ej. "Europa Occidental")
  capital: string;
  population?: number;
  flag: string;         // ruta del SVG local
  facts: string[];      // datos culturales curiosos en español
};

export const countries: Country[] = [
  {
    "code": "af",
    "name": "Afganistán",
    "continent": "Asia",
    "region": "Asia Meridional",
    "capital": "Kabul",
    "population": 43844111,
    "flag": "/flags/af.svg",
    "facts": [
      "Es un país montañoso atravesado por la cordillera del Hindú Kush.",
      "Fue un cruce clave de la Ruta de la Seda entre Asia y Europa.",
      "El lapislázuli se extrae aquí desde hace más de 6.000 años.",
      "El buzkashi, en el que jinetes disputan un cuerpo de cabra, es su deporte nacional.",
      "El persa darí y el pastún son sus dos lenguas oficiales.",
      "El valle de Bamiyán albergó dos budas gigantes tallados en la roca."
    ]
  },
  {
    "code": "al",
    "name": "Albania",
    "officialName": "República de Albania",
    "continent": "Europa",
    "region": "Europa Sudoriental",
    "capital": "Tirana",
    "population": 2349580,
    "flag": "/flags/al.svg",
    "facts": [
      "Miles de búnkeres de la época de la dictadura aún salpican su paisaje.",
      "El águila bicéfala de su bandera le da el apodo de 'tierra de las águilas'.",
      "Fue uno de los países más aislados de Europa durante el siglo XX.",
      "Asentir con la cabeza suele significar 'no', y negar, 'sí', al revés que en muchos países.",
      "Madre Teresa, de origen albanés, es una figura muy venerada en el país.",
      "La 'besa', la palabra de honor, es un valor central de su código tradicional."
    ]
  },
  {
    "code": "de",
    "name": "Alemania",
    "officialName": "República Federal de Alemania",
    "continent": "Europa",
    "region": "Europa Occidental",
    "capital": "Berlín",
    "population": 83491249,
    "flag": "/flags/de.svg",
    "facts": [
      "El muro de Berlín dividió la ciudad hasta su caída en 1989.",
      "La Oktoberfest de Múnich es la mayor fiesta de la cerveza del mundo.",
      "Cuenta con más de 20.000 castillos repartidos por su territorio.",
      "El automóvil moderno nació aquí: Karl Benz patentó el primero en 1886.",
      "La imprenta de tipos móviles de Gutenberg surgió en Maguncia hacia 1450.",
      "Su cultura del pan reúne cientos de variedades reconocidas como patrimonio."
    ]
  },
  {
    "code": "ad",
    "name": "Andorra",
    "officialName": "Principado de Andorra",
    "continent": "Europa",
    "region": "Europa Meridional",
    "capital": "Andorra la Vieja",
    "population": 82904,
    "flag": "/flags/ad.svg",
    "facts": [
      "La gobiernan dos copríncipes: el presidente de Francia y un obispo español.",
      "Es un pequeño país enclavado en los Pirineos.",
      "El catalán es su único idioma oficial.",
      "No tiene ejército propio y su defensa recae en Francia y España.",
      "Figura entre los países con mayor esperanza de vida del mundo.",
      "El esquí y el senderismo de montaña son sus grandes reclamos turísticos."
    ]
  },
  {
    "code": "ao",
    "name": "Angola",
    "officialName": "República de Angola",
    "continent": "África",
    "region": "África Central",
    "capital": "Luanda",
    "population": 39040039,
    "flag": "/flags/ao.svg",
    "facts": [
      "El portugués es su lengua oficial y lo habla la mayoría de la población.",
      "Las cataratas de Kalandula están entre las mayores de África.",
      "Ha sido uno de los mayores productores de petróleo del continente.",
      "La kizomba, género musical y de baile, nació en Angola.",
      "El palanca negra gigante es un antílope endémico y símbolo nacional.",
      "Luanda ha sido de las ciudades más caras del mundo para extranjeros."
    ]
  },
  {
    "code": "ag",
    "name": "Antigua y Barbuda",
    "officialName": "Antigua y Barbuda",
    "continent": "América del Norte",
    "region": "Caribe",
    "capital": "Saint John's",
    "population": 94209,
    "flag": "/flags/ag.svg",
    "facts": [
      "Presume de tener 365 playas, 'una para cada día del año'.",
      "El sol naciente de su bandera simboliza una nueva era.",
      "El astillero de Nelson es un puerto histórico de la época naval británica.",
      "El críquet es el deporte más popular, herencia de la época británica.",
      "La fragata magnífica anida en gran número en la laguna de Barbuda.",
      "El inglés es su idioma oficial."
    ]
  },
  {
    "code": "sa",
    "name": "Arabia Saudí",
    "officialName": "Reino de Arabia Saudí",
    "continent": "Asia",
    "region": "Asia Occidental",
    "capital": "Riad",
    "population": 36973555,
    "flag": "/flags/sa.svg",
    "facts": [
      "La Meca es la ciudad más sagrada del islam y meta de la peregrinación.",
      "Su bandera lleva la profesión de fe islámica y una espada.",
      "Alberga el Rub al-Jali, uno de los mayores desiertos de arena del mundo.",
      "Medina es la segunda ciudad más sagrada del islam.",
      "Es el mayor exportador de petróleo del mundo.",
      "No tuvo cines comerciales abiertos durante más de tres décadas, hasta 2018."
    ]
  },
  {
    "code": "dz",
    "name": "Argelia",
    "officialName": "República Argelina Democrática y Popular",
    "continent": "África",
    "region": "África del Norte",
    "capital": "Argel",
    "population": 47435312,
    "flag": "/flags/dz.svg",
    "facts": [
      "Es el país más extenso de África, con más del 80 % cubierto por el Sáhara.",
      "Las pinturas rupestres del Tassili n'Ajjer tienen miles de años.",
      "Su capital, Argel, es apodada 'la Blanca' por sus edificios encalados.",
      "El cuscús, compartido con el Magreb, es Patrimonio Cultural de la Humanidad.",
      "El árabe y el tamazight, o bereber, son sus lenguas oficiales.",
      "Timgad conserva una ciudad romana casi intacta en pleno país."
    ]
  },
  {
    "code": "ar",
    "name": "Argentina",
    "officialName": "República Argentina",
    "continent": "América del Sur",
    "region": "América del Sur",
    "capital": "Buenos Aires",
    "population": 45851378,
    "flag": "/flags/ar.svg",
    "facts": [
      "El tango nació en los barrios de Buenos Aires y Montevideo.",
      "El Aconcagua, con 6.961 m, es la montaña más alta fuera de Asia.",
      "Las cataratas del Iguazú, que comparte con Brasil, están entre las mayores del mundo.",
      "El mate, infusión de yerba, es la bebida social por excelencia.",
      "La Patagonia austral alberga glaciares como el Perito Moreno.",
      "Ha ganado tres Mundiales de fútbol: 1978, 1986 y 2022."
    ]
  },
  {
    "code": "am",
    "name": "Armenia",
    "officialName": "República de Armenia",
    "continent": "Asia",
    "region": "Asia Occidental",
    "capital": "Ereván",
    "population": 3086700,
    "flag": "/flags/am.svg",
    "facts": [
      "Fue el primer país en adoptar el cristianismo como religión oficial, en el año 301.",
      "El monte Ararat, su símbolo nacional, hoy queda en territorio turco.",
      "Tiene uno de los alfabetos propios más antiguos aún en uso.",
      "El duduk, flauta de madera de albaricoquero, tiene un sonido inconfundible.",
      "El monasterio de Guegard está parcialmente excavado en la roca de la montaña.",
      "El lavash, pan fino tradicional, es Patrimonio Cultural de la Humanidad."
    ]
  },
  {
    "code": "au",
    "name": "Australia",
    "officialName": "Mancomunidad de Australia",
    "continent": "Oceanía",
    "region": "Australia y Nueva Zelanda",
    "capital": "Canberra",
    "population": 27614411,
    "flag": "/flags/au.svg",
    "facts": [
      "Es a la vez un país, un continente y una gran isla.",
      "La Gran Barrera de Coral es la mayor estructura viva del planeta.",
      "Animales como el canguro y el koala solo viven aquí de forma natural.",
      "Uluru, una enorme roca rojiza, es un lugar sagrado para los aborígenes.",
      "Sus habitantes originarios tienen una de las culturas continuas más antiguas del mundo.",
      "El críquet y el fútbol australiano llenan sus estadios."
    ]
  },
  {
    "code": "at",
    "name": "Austria",
    "officialName": "República de Austria",
    "continent": "Europa",
    "region": "Europa Central",
    "capital": "Viena",
    "population": 9208163,
    "flag": "/flags/at.svg",
    "facts": [
      "Viena es la cuna de grandes compositores como Mozart, Beethoven y Strauss.",
      "Los Alpes cubren cerca de dos tercios de su territorio.",
      "Su Concierto de Año Nuevo se retransmite a todo el mundo.",
      "La tarta Sacher, de chocolate, nació en un hotel de Viena.",
      "La cultura del café vienés es Patrimonio Cultural Inmaterial.",
      "El psicoanálisis de Sigmund Freud nació en la Viena de hace un siglo."
    ]
  },
  {
    "code": "az",
    "name": "Azerbaiyán",
    "officialName": "República de Azerbaiyán",
    "continent": "Asia",
    "region": "Asia Occidental",
    "capital": "Bakú",
    "population": 10246996,
    "flag": "/flags/az.svg",
    "facts": [
      "Se le llama 'la tierra del fuego' por sus fuegos naturales de gas.",
      "Bakú se asienta a orillas del mar Caspio, por debajo del nivel del mar.",
      "El Yanar Dag es una ladera que arde de forma continua.",
      "La torre de la Doncella preside el casco viejo amurallado de Bakú.",
      "El zoroastrismo dejó aquí templos del fuego como el Ateshgah.",
      "El petróleo se explota aquí desde el siglo XIX, entre los primeros del mundo."
    ]
  },
  {
    "code": "bs",
    "name": "Bahamas",
    "officialName": "Mancomunidad de las Bahamas",
    "continent": "América del Norte",
    "region": "Caribe",
    "capital": "Nasáu",
    "population": 403033,
    "flag": "/flags/bs.svg",
    "facts": [
      "Es un archipiélago de unas 700 islas y cayos en el Atlántico.",
      "El agujero azul de Dean es uno de los más profundos del mundo.",
      "En Exuma hay playas donde nadan cerdos, una peculiar atracción.",
      "Cristóbal Colón tocó tierra en el Nuevo Mundo por primera vez en sus islas, en 1492.",
      "El Junkanoo es su vibrante desfile callejero de música y disfraces.",
      "Sus aguas turquesa son un destino mundial de buceo y pesca deportiva."
    ]
  },
  {
    "code": "bd",
    "name": "Bangladés",
    "officialName": "República Popular de Bangladés",
    "continent": "Asia",
    "region": "Asia Meridional",
    "capital": "Daca",
    "population": 175686899,
    "flag": "/flags/bd.svg",
    "facts": [
      "El delta del Ganges-Brahmaputra es el mayor del mundo.",
      "Los Sundarbans son el mayor bosque de manglares y hogar del tigre de Bengala.",
      "Es uno de los países más densamente poblados del mundo.",
      "El Día del Idioma Materno nació de una lucha por defender el bengalí.",
      "Sus ríos son tantos que se le llama la tierra de mil corrientes de agua.",
      "El yute, fibra natural, fue apodado 'la fibra dorada' de su economía."
    ]
  },
  {
    "code": "bb",
    "name": "Barbados",
    "officialName": "Barbados",
    "continent": "América del Norte",
    "region": "Caribe",
    "capital": "Bridgetown",
    "population": 282623,
    "flag": "/flags/bb.svg",
    "facts": [
      "Es una de las cunas del ron, destilado aquí desde el siglo XVII.",
      "El tridente roto de su bandera simboliza la ruptura con el pasado colonial.",
      "Es la tierra natal de la cantante Rihanna.",
      "El críquet es casi una religión nacional en la isla.",
      "Su nombre, 'los barbudos', alude a las higueras de raíces colgantes.",
      "El Crop Over es su gran festival, heredado de la cosecha de la caña."
    ]
  },
  {
    "code": "bh",
    "name": "Baréin",
    "officialName": "Reino de Baréin",
    "continent": "Asia",
    "region": "Asia Occidental",
    "capital": "Manama",
    "population": 1600366,
    "flag": "/flags/bh.svg",
    "facts": [
      "Es un archipiélago unido a Arabia Saudí por una calzada de unos 25 km.",
      "Los picos blancos de su bandera representan los cinco pilares del islam.",
      "Fue un centro histórico de la pesca de perlas en el Golfo.",
      "El Árbol de la Vida crece solo en pleno desierto sin fuente de agua visible.",
      "Fue de los primeros lugares del Golfo en hallar petróleo, en 1932.",
      "Acoge un Gran Premio de Fórmula 1 en un circuito del desierto."
    ]
  },
  {
    "code": "be",
    "name": "Bélgica",
    "officialName": "Reino de Bélgica",
    "continent": "Europa",
    "region": "Europa Occidental",
    "capital": "Bruselas",
    "population": 11941781,
    "flag": "/flags/be.svg",
    "facts": [
      "Es la sede de las principales instituciones de la Unión Europea.",
      "Se le atribuye la invención de las patatas fritas y es famosa por su chocolate.",
      "Produce cientos de variedades de cerveza, muchas de tradición monástica.",
      "El cómic es todo un arte aquí: Tintín y los Pitufos nacieron en el país.",
      "El saxofón fue inventado por el belga Adolphe Sax.",
      "Llegó a pasar más de 500 días sin gobierno tras unas elecciones, un récord mundial."
    ]
  },
  {
    "code": "bz",
    "name": "Belice",
    "officialName": "Belice",
    "continent": "América del Norte",
    "region": "América Central",
    "capital": "Belmopán",
    "population": 422924,
    "flag": "/flags/bz.svg",
    "facts": [
      "El Gran Agujero Azul es un famoso sumidero marino ideal para el buceo.",
      "Alberga parte del segundo mayor sistema de arrecifes del mundo.",
      "Es el único país de Centroamérica cuyo idioma oficial es el inglés.",
      "Fue un importante centro de la civilización maya, con ruinas como Caracol.",
      "El criollo beliceño y el garífuna conviven con el inglés y el español.",
      "Trasladó su capital tierra adentro, a Belmopán, tras un huracán devastador."
    ]
  },
  {
    "code": "bj",
    "name": "Benín",
    "officialName": "República de Benín",
    "continent": "África",
    "region": "África Occidental",
    "capital": "Porto Novo",
    "population": 14814460,
    "flag": "/flags/bj.svg",
    "facts": [
      "Es la cuna histórica del vudú, hoy religión oficialmente reconocida.",
      "El antiguo reino de Dahomey tuvo un célebre cuerpo de mujeres guerreras.",
      "Ganvié es una ciudad lacustre construida sobre pilotes.",
      "El antiguo reino de Dahomey dejó palacios reales Patrimonio de la Humanidad en Abomey.",
      "El francés es su lengua oficial.",
      "Cada 10 de enero celebra una fiesta nacional dedicada al vudú."
    ]
  },
  {
    "code": "by",
    "name": "Bielorrusia",
    "officialName": "República de Bielorrusia",
    "continent": "Europa",
    "region": "Europa Oriental",
    "capital": "Minsk",
    "population": 9085991,
    "flag": "/flags/by.svg",
    "facts": [
      "Comparte el bosque de Białowieża, hogar del bisonte europeo.",
      "Cerca del 40 % de su territorio está cubierto de bosques.",
      "Es uno de los países más llanos de Europa.",
      "Los 'draniki', tortitas de patata rallada, son su plato más típico.",
      "Recibió buena parte de la lluvia radiactiva del accidente de Chernóbil de 1986.",
      "El bielorruso y el ruso son sus dos idiomas oficiales."
    ]
  },
  {
    "code": "bo",
    "name": "Bolivia",
    "officialName": "Estado Plurinacional de Bolivia",
    "continent": "América del Sur",
    "region": "América del Sur",
    "capital": "Sucre",
    "population": 12581843,
    "flag": "/flags/bo.svg",
    "facts": [
      "El salar de Uyuni es el mayor desierto de sal del mundo.",
      "Tiene dos capitales: Sucre, la constitucional, y La Paz, sede del gobierno.",
      "El lago Titicaca es el lago navegable más alto del mundo.",
      "La Paz, su sede de gobierno, es la capital administrativa más alta del mundo.",
      "Reconoce 37 idiomas oficiales, entre ellos el quechua y el aimara.",
      "El teleférico de La Paz y El Alto es una de las redes urbanas más largas del mundo."
    ]
  },
  {
    "code": "ba",
    "name": "Bosnia y Herzegovina",
    "officialName": "Bosnia y Herzegovina",
    "continent": "Europa",
    "region": "Europa Sudoriental",
    "capital": "Sarajevo",
    "population": 3140095,
    "flag": "/flags/ba.svg",
    "facts": [
      "El puente de Mostar, reconstruido tras la guerra, es Patrimonio de la Humanidad.",
      "Sarajevo acogió los Juegos Olímpicos de invierno de 1984.",
      "En su cultura se cruzan las influencias otomana y austrohúngara.",
      "El café bosnio se sirve en cezve de cobre siguiendo un ritual pausado.",
      "Las cascadas de Kravice muestran aguas de un turquesa intenso.",
      "En Sarajevo se cruzan mezquitas, iglesias y sinagogas en pocas calles."
    ]
  },
  {
    "code": "bw",
    "name": "Botswana",
    "officialName": "República de Botswana",
    "continent": "África",
    "region": "África Austral",
    "capital": "Gaborone",
    "population": 2562122,
    "flag": "/flags/bw.svg",
    "facts": [
      "El delta del Okavango es uno de los mayores deltas interiores del mundo.",
      "Gran parte del país lo ocupa el desierto del Kalahari.",
      "Es uno de los mayores productores de diamantes del mundo.",
      "Alberga una de las mayores poblaciones de elefantes del mundo.",
      "Su moneda, la pula, significa 'lluvia', un bien preciado en el desierto.",
      "Las salinas de Makgadikgadi están entre las mayores del planeta."
    ]
  },
  {
    "code": "br",
    "name": "Brasil",
    "officialName": "República Federativa del Brasil",
    "continent": "América del Sur",
    "region": "América del Sur",
    "capital": "Brasilia",
    "population": 212812405,
    "flag": "/flags/br.svg",
    "facts": [
      "El lema 'Ordem e Progresso' de su bandera se inspira en el positivismo.",
      "Alberga la mayor parte de la selva amazónica.",
      "Es el único país de América cuyo idioma oficial es el portugués.",
      "El carnaval de Río es una de las mayores fiestas del mundo.",
      "La esfera azul de su bandera reproduce el cielo de Río de una noche de 1889.",
      "Ha ganado cinco Mundiales de fútbol, más que ningún otro país."
    ]
  },
  {
    "code": "bn",
    "name": "Brunéi",
    "officialName": "Nación de Brunéi, Morada de la Paz",
    "continent": "Asia",
    "region": "Sudeste Asiático",
    "capital": "Bandar Seri Begawan",
    "population": 466330,
    "flag": "/flags/bn.svg",
    "facts": [
      "Su sultán es uno de los jefes de Estado que más tiempo llevan en el poder.",
      "Su riqueza procede de las grandes reservas de petróleo y gas.",
      "La mezquita de Omar Ali Saifuddin es un emblema de su capital.",
      "Está rodeado por Malasia, que además lo divide en dos partes.",
      "Kampong Ayer es un enorme barrio construido sobre pilotes en el agua.",
      "No cobra impuesto sobre la renta a sus ciudadanos."
    ]
  },
  {
    "code": "bg",
    "name": "Bulgaria",
    "officialName": "República de Bulgaria",
    "continent": "Europa",
    "region": "Europa Sudoriental",
    "capital": "Sofía",
    "population": 6433302,
    "flag": "/flags/bg.svg",
    "facts": [
      "Es uno de los mayores productores mundiales de esencia de rosa.",
      "El alfabeto cirílico se desarrolló en su territorio en la Edad Media.",
      "El yogur búlgaro es conocido por su bacteria característica.",
      "Al asentir mueven la cabeza de lado a lado, y al negar, de arriba abajo.",
      "El baile sobre brasas, el nestinarstvo, es Patrimonio Cultural de la Humanidad.",
      "Plovdiv es una de las ciudades habitadas más antiguas de Europa."
    ]
  },
  {
    "code": "bf",
    "name": "Burkina Faso",
    "officialName": "Burkina Faso",
    "continent": "África",
    "region": "África Occidental",
    "capital": "Uagadugú",
    "population": 24074580,
    "flag": "/flags/bf.svg",
    "facts": [
      "Su nombre significa 'la tierra de los hombres íntegros'.",
      "Acoge el FESPACO, el mayor festival de cine de África.",
      "El pueblo mossi conserva una monarquía tradicional con siglos de historia.",
      "El francés es su lengua oficial, junto a decenas de idiomas locales.",
      "Sus antiguos sitios de fundición de hierro son Patrimonio de la Humanidad.",
      "El algodón es uno de sus principales productos de exportación."
    ]
  },
  {
    "code": "bi",
    "name": "Burundi",
    "officialName": "República de Burundi",
    "continent": "África",
    "region": "África Oriental",
    "capital": "Gitega",
    "population": 14390003,
    "flag": "/flags/bi.svg",
    "facts": [
      "La capital política se trasladó de Buyumbura a Gitega en 2019.",
      "Sus tambores rituales karyenda son Patrimonio Cultural de la Humanidad.",
      "El café y el té están entre sus principales exportaciones.",
      "El kirundi es su lengua nacional, hablada por casi toda la población.",
      "Se asoma al lago Tanganica, uno de los más profundos y largos del mundo.",
      "Es uno de los países más densamente poblados de África continental."
    ]
  },
  {
    "code": "bt",
    "name": "Bután",
    "officialName": "Reino de Bután",
    "continent": "Asia",
    "region": "Asia Meridional",
    "capital": "Timbu",
    "population": 796682,
    "flag": "/flags/bt.svg",
    "facts": [
      "Mide su progreso con la 'Felicidad Nacional Bruta', no solo con el PIB.",
      "Es un país con emisiones de carbono negativas gracias a sus bosques.",
      "El dragón de su bandera, el Druk, le da el nombre de 'país del dragón del trueno'.",
      "El monasterio de Taktsang, 'el Nido del Tigre', cuelga de un acantilado.",
      "La televisión e internet no llegaron oficialmente hasta 1999.",
      "El tiro con arco es su deporte nacional y una fiesta comunitaria."
    ]
  },
  {
    "code": "cv",
    "name": "Cabo Verde",
    "officialName": "República de Cabo Verde",
    "continent": "África",
    "region": "África Occidental",
    "capital": "Praia",
    "population": 527326,
    "flag": "/flags/cv.svg",
    "facts": [
      "Es un archipiélago volcánico de diez islas en el Atlántico.",
      "La morna, su música tradicional, es Patrimonio de la Humanidad.",
      "La cantante Cesária Évora llevó su música por todo el mundo.",
      "El volcán del Fogo, aún activo, es el punto más alto del país.",
      "El criollo caboverdiano convive con el portugués en el día a día.",
      "Buena parte de su población vive fuera, en una amplia diáspora."
    ]
  },
  {
    "code": "kh",
    "name": "Camboya",
    "officialName": "Reino de Camboya",
    "continent": "Asia",
    "region": "Sudeste Asiático",
    "capital": "Nom Pen",
    "population": 17847982,
    "flag": "/flags/kh.svg",
    "facts": [
      "Angkor Wat es el mayor monumento religioso del mundo.",
      "Es el único país cuya bandera muestra un edificio: Angkor Wat.",
      "El lago Tonlé Sap invierte el sentido de su corriente cada año.",
      "El jemer usa uno de los alfabetos más extensos del mundo.",
      "La danza clásica apsara es Patrimonio Cultural de la Humanidad.",
      "El río Mekong atraviesa el país y sustenta su pesca y agricultura."
    ]
  },
  {
    "code": "cm",
    "name": "Camerún",
    "officialName": "República de Camerún",
    "continent": "África",
    "region": "África Central",
    "capital": "Yaundé",
    "population": 29879337,
    "flag": "/flags/cm.svg",
    "facts": [
      "Se le llama 'África en miniatura' por su diversidad de climas y paisajes.",
      "El monte Camerún es un volcán activo y la cima más alta de África Occidental.",
      "Su selección de fútbol, los 'Leones Indomables', es histórica en el continente.",
      "Tiene dos lenguas oficiales, francés e inglés, por su historia colonial.",
      "Roger Milla brilló en el Mundial de 1990 con sus bailes de celebración.",
      "Se cultivan aquí algunos de los cacaos más apreciados del mundo."
    ]
  },
  {
    "code": "ca",
    "name": "Canadá",
    "officialName": "Canadá",
    "continent": "América del Norte",
    "region": "América del Norte",
    "capital": "Ottawa",
    "population": 41651653,
    "flag": "/flags/ca.svg",
    "facts": [
      "Tiene la costa más larga del mundo.",
      "La hoja de arce de su bandera es un símbolo nacional desde 1965.",
      "Alberga cerca del 20 % del agua dulce del planeta.",
      "El inglés y el francés son sus dos idiomas oficiales.",
      "El jarabe de arce se produce sobre todo en Quebec, líder mundial.",
      "El hockey sobre hielo es su deporte nacional de invierno."
    ]
  },
  {
    "code": "qa",
    "name": "Catar",
    "officialName": "Estado de Catar",
    "continent": "Asia",
    "region": "Asia Occidental",
    "capital": "Doha",
    "population": 2972215,
    "flag": "/flags/qa.svg",
    "facts": [
      "Organizó el Mundial de fútbol de 2022, el primero en Oriente Medio.",
      "Es una península que se adentra en el golfo Pérsico.",
      "Su bandera granate y blanca tiene una forma más alargada de lo habitual.",
      "Es uno de los mayores exportadores de gas natural licuado del mundo.",
      "La cadena de televisión Al Jazeera tiene su sede en Doha.",
      "Ha estado entre los países con mayor renta per cápita del mundo."
    ]
  },
  {
    "code": "td",
    "name": "Chad",
    "officialName": "República del Chad",
    "continent": "África",
    "region": "África Central",
    "capital": "Yamena",
    "population": 21003705,
    "flag": "/flags/td.svg",
    "facts": [
      "El lago Chad, que da nombre al país, se ha reducido mucho desde 1960.",
      "El macizo del Tibesti alberga el volcán más alto del Sáhara.",
      "La meseta del Ennedi, con sus arcos de arenisca, es Patrimonio de la Humanidad.",
      "El árabe y el francés son sus lenguas oficiales.",
      "En Yamena confluyen los ríos Chari y Logone.",
      "Los lagos de Ounianga, en pleno desierto, son Patrimonio de la Humanidad."
    ]
  },
  {
    "code": "cl",
    "name": "Chile",
    "officialName": "República de Chile",
    "continent": "América del Sur",
    "region": "América del Sur",
    "capital": "Santiago",
    "population": 19859921,
    "flag": "/flags/cl.svg",
    "facts": [
      "Es el país más largo y estrecho del mundo, con más de 4.000 km de norte a sur.",
      "El desierto de Atacama es el más árido del planeta.",
      "La isla de Pascua, con sus moáis, forma parte de su territorio.",
      "Alberga algunos de los observatorios astronómicos más importantes del mundo.",
      "La cueca es su baile nacional.",
      "Es el mayor productor de cobre del mundo."
    ]
  },
  {
    "code": "cn",
    "name": "China",
    "officialName": "República Popular China",
    "continent": "Asia",
    "region": "Asia Oriental",
    "capital": "Pekín",
    "population": 1406585000,
    "flag": "/flags/cn.svg",
    "facts": [
      "La Gran Muralla se extiende por miles de kilómetros.",
      "Es uno de los dos países más poblados del mundo.",
      "Inventó el papel, la brújula, la pólvora y la imprenta.",
      "El panda gigante vive de forma natural solo en sus bosques de bambú.",
      "El té y la seda nacieron en su cultura hace miles de años.",
      "Su Año Nuevo desata la mayor migración humana anual del planeta."
    ]
  },
  {
    "code": "cy",
    "name": "Chipre",
    "officialName": "República de Chipre",
    "continent": "Europa",
    "region": "Europa Meridional",
    "capital": "Nicosia",
    "population": 1370754,
    "flag": "/flags/cy.svg",
    "facts": [
      "Su capital, Nicosia, es la última capital dividida de Europa.",
      "La mitología sitúa aquí el nacimiento de Afrodita, diosa del amor.",
      "Su bandera muestra el mapa de la isla en color cobre.",
      "Su nombre se relaciona con el cobre, metal explotado aquí en la Antigüedad.",
      "El griego y el turco son sus dos idiomas oficiales.",
      "El halloumi, queso que no se derrite al asarlo, es originario de la isla."
    ]
  },
  {
    "code": "va",
    "name": "Ciudad del Vaticano",
    "officialName": "Estado de la Ciudad del Vaticano",
    "continent": "Europa",
    "region": "Europa Meridional",
    "capital": "Ciudad del Vaticano",
    "population": 764,
    "flag": "/flags/va.svg",
    "facts": [
      "Es el país más pequeño del mundo en superficie y población.",
      "Alberga la Capilla Sixtina, con los frescos de Miguel Ángel.",
      "Su Guardia Suiza protege al papa desde 1506.",
      "La basílica de San Pedro es una de las mayores iglesias del mundo.",
      "Tiene su propio correo y acuña euros con la efigie del papa.",
      "El latín sigue siendo una de sus lenguas oficiales."
    ]
  },
  {
    "code": "co",
    "name": "Colombia",
    "officialName": "República de Colombia",
    "continent": "América del Sur",
    "region": "América del Sur",
    "capital": "Bogotá",
    "population": 53425635,
    "flag": "/flags/co.svg",
    "facts": [
      "Es uno de los países con más biodiversidad del mundo.",
      "Es el mayor productor mundial de esmeraldas.",
      "El café colombiano es reconocido por su calidad en todo el mundo.",
      "Tiene costa en el Pacífico y en el Atlántico, algo único en Sudamérica.",
      "El carnaval de Barranquilla es Patrimonio Cultural de la Humanidad.",
      "La cumbia y el vallenato son ritmos nacidos en su costa caribeña."
    ]
  },
  {
    "code": "km",
    "name": "Comoras",
    "officialName": "Unión de las Comoras",
    "continent": "África",
    "region": "África Oriental",
    "capital": "Moroni",
    "population": 882847,
    "flag": "/flags/km.svg",
    "facts": [
      "Es un archipiélago volcánico situado en el canal de Mozambique.",
      "Es uno de los mayores productores mundiales de ylang-ylang, usado en perfumería.",
      "Su bandera lleva cuatro franjas y cuatro estrellas, una por cada isla principal.",
      "El celacanto, pez que se creía extinto con los dinosaurios, vive en sus aguas.",
      "Tiene tres idiomas oficiales: comorense, francés y árabe.",
      "El volcán Karthala es uno de los mayores activos del mundo."
    ]
  },
  {
    "code": "kp",
    "name": "Corea del Norte",
    "officialName": "República Popular Democrática de Corea",
    "continent": "Asia",
    "region": "Asia Oriental",
    "capital": "Pyongyang",
    "population": 26571036,
    "flag": "/flags/kp.svg",
    "facts": [
      "Usa el calendario Juche, que cuenta los años desde 1912.",
      "El monte Paektu es una montaña sagrada en su cultura nacional.",
      "Sigue técnicamente en guerra con Corea del Sur desde 1953.",
      "El Estadio Primero de Mayo de Pyongyang es de los mayores del mundo por aforo.",
      "El Arirang, canción tradicional coreana, es muy querido en toda la península.",
      "El coreano se escribe con el hangul, un alfabeto creado en el siglo XV."
    ]
  },
  {
    "code": "kr",
    "name": "Corea del Sur",
    "officialName": "República de Corea",
    "continent": "Asia",
    "region": "Asia Oriental",
    "capital": "Seúl",
    "population": 51684564,
    "flag": "/flags/kr.svg",
    "facts": [
      "El símbolo yin-yang de su bandera representa el equilibrio del universo.",
      "Es cuna del K-pop y de una potente industria tecnológica.",
      "El taekwondo, arte marcial olímpico, nació en su territorio.",
      "El kimchi, col fermentada, acompaña casi todas sus comidas.",
      "El hangul, su alfabeto, se diseñó para que fuera fácil de aprender.",
      "Es uno de los países con internet de alta velocidad más extendido del mundo."
    ]
  },
  {
    "code": "ci",
    "name": "Costa de Marfil",
    "officialName": "República de Costa de Marfil",
    "continent": "África",
    "region": "África Occidental",
    "capital": "Yamusukro",
    "population": 32711547,
    "flag": "/flags/ci.svg",
    "facts": [
      "Es el mayor productor mundial de cacao.",
      "La basílica de Yamusukro es una de las mayores iglesias del mundo.",
      "Abiyán es su mayor ciudad y su centro económico.",
      "El francés es su lengua oficial.",
      "Su selección de fútbol, 'los Elefantes', ha ganado la Copa de África.",
      "Trasladó su capital de Abiyán a Yamusukro en 1983."
    ]
  },
  {
    "code": "cr",
    "name": "Costa Rica",
    "officialName": "República de Costa Rica",
    "continent": "América del Norte",
    "region": "América Central",
    "capital": "San José",
    "population": 5152950,
    "flag": "/flags/cr.svg",
    "facts": [
      "Abolió su ejército en 1948 y destinó esos recursos a educación y salud.",
      "Alberga cerca del 5 % de la biodiversidad del planeta.",
      "Su lema, 'pura vida', resume su filosofía de vida.",
      "Genera casi toda su electricidad con fuentes renovables.",
      "Sus quetzales y perezosos atraen a viajeros de todo el mundo.",
      "Aparece entre los países más felices del mundo en varios estudios."
    ]
  },
  {
    "code": "hr",
    "name": "Croacia",
    "officialName": "República de Croacia",
    "continent": "Europa",
    "region": "Europa Sudoriental",
    "capital": "Zagreb",
    "population": 3876200,
    "flag": "/flags/hr.svg",
    "facts": [
      "La corbata tiene su origen en un accesorio croata del siglo XVII.",
      "Los lagos de Plitvice, escalonados y turquesa, son Patrimonio de la Humanidad.",
      "Su costa adriática cuenta con más de mil islas.",
      "El lápiz mecánico fue inventado por el croata Slavoljub Penkala.",
      "Dubrovnik, ciudad amurallada, fue escenario de 'Juego de tronos'.",
      "El dálmata, perro moteado, toma su nombre de la región de Dalmacia."
    ]
  },
  {
    "code": "cu",
    "name": "Cuba",
    "officialName": "República de Cuba",
    "continent": "América del Norte",
    "region": "Caribe",
    "capital": "La Habana",
    "population": 10937203,
    "flag": "/flags/cu.svg",
    "facts": [
      "Es la isla más grande del Caribe.",
      "Sus puros habanos son reconocidos en todo el mundo.",
      "La Habana Vieja conserva una arquitectura colonial declarada Patrimonio.",
      "El son y el mambo, raíces de la salsa, nacieron en la isla.",
      "Sus coloridos autos clásicos de los años 50 siguen circulando por las calles.",
      "El béisbol es su deporte nacional y una gran pasión popular."
    ]
  },
  {
    "code": "dk",
    "name": "Dinamarca",
    "officialName": "Reino de Dinamarca",
    "continent": "Europa",
    "region": "Europa del Norte",
    "capital": "Copenhague",
    "population": 6009169,
    "flag": "/flags/dk.svg",
    "facts": [
      "El Dannebrog es considerado la bandera nacional más antigua aún en uso.",
      "El concepto 'hygge', de bienestar y calidez, nació aquí.",
      "Es cuna del escritor de cuentos Hans Christian Andersen.",
      "La Sirenita, inspirada en su cuento, es un símbolo de Copenhague.",
      "Las piezas de LEGO fueron creadas por una empresa danesa.",
      "Es uno de los países líderes mundiales en energía eólica."
    ]
  },
  {
    "code": "dm",
    "name": "Dominica",
    "officialName": "Mancomunidad de Dominica",
    "continent": "América del Norte",
    "region": "Caribe",
    "capital": "Roseau",
    "population": 65871,
    "flag": "/flags/dm.svg",
    "facts": [
      "Se la llama 'la isla de la naturaleza' del Caribe por su exuberante selva.",
      "Alberga un lago hirviente, el segundo mayor de este tipo del mundo.",
      "Es uno de los pocos lugares donde aún viven descendientes de los caribes.",
      "Su bandera es una de las pocas del mundo que incluye el color morado.",
      "El loro sisserou, ave endémica, es su símbolo nacional.",
      "Sus ríos y cascadas la hacen ideal para el senderismo tropical."
    ]
  },
  {
    "code": "ec",
    "name": "Ecuador",
    "officialName": "República del Ecuador",
    "continent": "América del Sur",
    "region": "América del Sur",
    "capital": "Quito",
    "population": 18289896,
    "flag": "/flags/ec.svg",
    "facts": [
      "Debe su nombre a la línea del ecuador, que lo atraviesa.",
      "Las islas Galápagos inspiraron la teoría de la evolución de Darwin.",
      "La cima del volcán Chimborazo es el punto más alejado del centro de la Tierra.",
      "El sombrero 'panamá' se teje en realidad en Ecuador.",
      "Quito fue de los primeros lugares nombrados Patrimonio de la Humanidad.",
      "El quichua es hablado por comunidades andinas junto al español."
    ]
  },
  {
    "code": "eg",
    "name": "Egipto",
    "officialName": "República Árabe de Egipto",
    "continent": "África",
    "region": "África del Norte",
    "capital": "El Cairo",
    "population": 118365995,
    "flag": "/flags/eg.svg",
    "facts": [
      "La Gran Pirámide de Guiza es la única de las siete maravillas antiguas aún en pie.",
      "El Nilo, uno de los ríos más largos del mundo, ha sido su fuente de vida milenaria.",
      "El águila dorada de su bandera es el 'águila de Saladino'.",
      "La Esfinge de Guiza es una de las estatuas más grandes y antiguas del mundo.",
      "Los faraones escribían con jeroglíficos, descifrados gracias a la piedra Rosetta.",
      "El canal de Suez une el Mediterráneo con el mar Rojo."
    ]
  },
  {
    "code": "sv",
    "name": "El Salvador",
    "officialName": "República de El Salvador",
    "continent": "América del Norte",
    "region": "América Central",
    "capital": "San Salvador",
    "population": 6365503,
    "flag": "/flags/sv.svg",
    "facts": [
      "Es el país más pequeño y densamente poblado de Centroamérica.",
      "Se le llama 'el país de los volcanes' por su intensa actividad geológica.",
      "En 2021 fue el primer país en adoptar el bitcóin como moneda de curso legal.",
      "Joya de Cerén es una aldea maya sepultada por ceniza, 'la Pompeya de América'.",
      "Sus pupusas, tortillas rellenas, son el plato nacional.",
      "Tiene costa en el Pacífico, pero no en el Atlántico."
    ]
  },
  {
    "code": "ae",
    "name": "Emiratos Árabes Unidos",
    "officialName": "Emiratos Árabes Unidos",
    "continent": "Asia",
    "region": "Asia Occidental",
    "capital": "Abu Dabi",
    "population": 11513149,
    "flag": "/flags/ae.svg",
    "facts": [
      "El Burj Khalifa de Dubái es el edificio más alto del mundo.",
      "Es una federación de siete emiratos.",
      "En pocas décadas pasó de aldeas de pescadores a metrópolis futuristas.",
      "Dubái tiene islas artificiales con forma de palmera visibles desde el espacio.",
      "El árabe es su idioma oficial, aunque conviven decenas de nacionalidades.",
      "El halcón es un símbolo nacional y la cetrería, una tradición arraigada."
    ]
  },
  {
    "code": "er",
    "name": "Eritrea",
    "officialName": "Estado de Eritrea",
    "continent": "África",
    "region": "África Oriental",
    "capital": "Asmara",
    "population": 3607003,
    "flag": "/flags/er.svg",
    "facts": [
      "Asmara es Patrimonio de la Humanidad por su arquitectura art déco modernista.",
      "Obtuvo la independencia de Etiopía en 1993 tras una larga guerra.",
      "Tiene costa en el mar Rojo, pero carece de ríos permanentes.",
      "Un antiguo tren italiano de vía estrecha une Asmara con la costa del mar Rojo.",
      "El tigriña y el árabe están entre sus lenguas de uso oficial.",
      "El archipiélago de Dahlak, en el mar Rojo, está apenas explorado."
    ]
  },
  {
    "code": "sk",
    "name": "Eslovaquia",
    "officialName": "República Eslovaca",
    "continent": "Europa",
    "region": "Europa Central",
    "capital": "Bratislava",
    "population": 5413813,
    "flag": "/flags/sk.svg",
    "facts": [
      "Presume de tener uno de los mayores números de castillos por habitante del mundo.",
      "Bratislava limita con dos países, Austria y Hungría.",
      "Los Cárpatos atraviesan gran parte de su territorio.",
      "El geiser de Herľany brota a chorros con intervalos de varias horas.",
      "Sus cuevas de karst, algunas heladas, son Patrimonio de la Humanidad.",
      "La fujara, una flauta pastoril gigante, es Patrimonio Cultural Inmaterial."
    ]
  },
  {
    "code": "si",
    "name": "Eslovenia",
    "officialName": "República de Eslovenia",
    "continent": "Europa",
    "region": "Europa Central",
    "capital": "Liubliana",
    "population": 2130986,
    "flag": "/flags/si.svg",
    "facts": [
      "Más de la mitad de su territorio está cubierto de bosques.",
      "El lago Bled, con una isla y un castillo, es una postal alpina.",
      "Su nombre en inglés, Slovenia, contiene la palabra 'love' (amor).",
      "Las cuevas de Postojna se recorren en un tren subterráneo.",
      "El olm, anfibio ciego apodado 'dragón bebé', habita sus cuevas.",
      "Fue declarada el primer país verde del mundo por su turismo sostenible."
    ]
  },
  {
    "code": "es",
    "name": "España",
    "officialName": "Reino de España",
    "continent": "Europa",
    "region": "Europa Meridional",
    "capital": "Madrid",
    "population": 49355143,
    "flag": "/flags/es.svg",
    "facts": [
      "El español es el segundo idioma más hablado del mundo como lengua materna.",
      "La Sagrada Familia de Barcelona lleva más de un siglo en construcción.",
      "La siesta y las tapas son costumbres muy asociadas al país.",
      "La Alhambra de Granada es una joya de la arquitectura andalusí.",
      "El flamenco, con cante y baile, es Patrimonio Cultural de la Humanidad.",
      "El Camino de Santiago atrae a peregrinos de todo el mundo."
    ]
  },
  {
    "code": "us",
    "name": "Estados Unidos",
    "officialName": "Estados Unidos de América",
    "continent": "América del Norte",
    "region": "América del Norte",
    "capital": "Washington D. C.",
    "population": 341784857,
    "flag": "/flags/us.svg",
    "facts": [
      "Las 50 estrellas de su bandera son los estados y las 13 franjas, las colonias originales.",
      "El Gran Cañón del Colorado alcanza más de 1,6 km de profundidad.",
      "Con 50 estados, es uno de los países más extensos del mundo.",
      "El jazz, el blues y el rock nacieron en su territorio.",
      "Yellowstone fue el primer parque nacional del mundo.",
      "Hollywood convirtió a Los Ángeles en la capital mundial del cine."
    ]
  },
  {
    "code": "ee",
    "name": "Estonia",
    "officialName": "República de Estonia",
    "continent": "Europa",
    "region": "Europa del Norte",
    "capital": "Tallin",
    "population": 1366475,
    "flag": "/flags/ee.svg",
    "facts": [
      "Fue pionera en el voto por internet en elecciones nacionales.",
      "Casi la mitad de su territorio está cubierto de bosques.",
      "El casco antiguo de Tallin es uno de los mejor conservados de Europa.",
      "Skype fue desarrollado en buena parte por ingenieros estonios.",
      "Casi todos sus trámites públicos se hacen por internet.",
      "Sus festivales de canto reúnen a decenas de miles de coristas."
    ]
  },
  {
    "code": "sz",
    "name": "Esuatini",
    "officialName": "Reino de Esuatini",
    "continent": "África",
    "region": "África Austral",
    "capital": "Mbabane",
    "population": 1256174,
    "flag": "/flags/sz.svg",
    "facts": [
      "Es una de las últimas monarquías absolutas del mundo.",
      "Cambió su nombre de Suazilandia a Esuatini en 2018.",
      "La colorida danza de las cañas reúne a miles de jóvenes cada año.",
      "Su bandera muestra un escudo y lanzas de guerrero tradicional.",
      "La fiesta del Incwala, del rey y la cosecha, es su ritual más sagrado.",
      "Está rodeado casi por completo por Sudáfrica y limita con Mozambique."
    ]
  },
  {
    "code": "et",
    "name": "Etiopía",
    "officialName": "República Democrática Federal de Etiopía",
    "continent": "África",
    "region": "África Oriental",
    "capital": "Adís Abeba",
    "population": 135472051,
    "flag": "/flags/et.svg",
    "facts": [
      "Usa un calendario de 13 meses que va unos siete años por detrás del gregoriano.",
      "Es la cuna del café arábica, originario de la región de Kaffa.",
      "Es uno de los pocos países africanos que nunca fue colonizado de forma duradera.",
      "Lucy, uno de los ancestros humanos más famosos, se halló en su suelo.",
      "Las iglesias de Lalibela están excavadas en la roca de una sola pieza.",
      "El injera, un pan esponjoso y agrio, es la base de sus comidas."
    ]
  },
  {
    "code": "ph",
    "name": "Filipinas",
    "officialName": "República de Filipinas",
    "continent": "Asia",
    "region": "Sudeste Asiático",
    "capital": "Manila",
    "population": 116786962,
    "flag": "/flags/ph.svg",
    "facts": [
      "Es un archipiélago de más de 7.000 islas.",
      "Su bandera se invierte para indicar estado de guerra, un caso único.",
      "Las terrazas de arroz de Banaue tienen unos 2.000 años.",
      "El jeepney, colorido transporte urbano, se creó a partir de jeeps militares.",
      "El tarsero, primate de ojos enormes, vive en sus bosques.",
      "Es uno de los mayores países de mayoría católica de Asia."
    ]
  },
  {
    "code": "fi",
    "name": "Finlandia",
    "officialName": "República de Finlandia",
    "continent": "Europa",
    "region": "Europa del Norte",
    "capital": "Helsinki",
    "population": 5646436,
    "flag": "/flags/fi.svg",
    "facts": [
      "Es el país con más lagos de Europa: cerca de 188.000.",
      "Es la cuna de la sauna, con millones repartidas por el país.",
      "En su Laponia se sitúa la aldea turística de Papá Noel.",
      "Ha encabezado varios años la lista de los países más felices del mundo.",
      "Las auroras boreales iluminan sus cielos del norte en invierno.",
      "El campeonato mundial de llevar a la esposa a cuestas nació aquí."
    ]
  },
  {
    "code": "fj",
    "name": "Fiyi",
    "officialName": "República de Fiyi",
    "continent": "Oceanía",
    "region": "Melanesia",
    "capital": "Suva",
    "population": 933154,
    "flag": "/flags/fj.svg",
    "facts": [
      "Es un archipiélago de más de 300 islas en el Pacífico Sur.",
      "El rugby es el deporte nacional y una gran pasión local.",
      "El meridiano 180, en la línea de cambio de fecha, pasa muy cerca.",
      "El kava, bebida ceremonial de raíz, se comparte en reuniones sociales.",
      "La Union Jack británica aún aparece en un rincón de su bandera.",
      "Sus aguas son un destino mundial del buceo entre corales."
    ]
  },
  {
    "code": "fr",
    "name": "Francia",
    "officialName": "República Francesa",
    "continent": "Europa",
    "region": "Europa Occidental",
    "capital": "París",
    "population": 68720337,
    "flag": "/flags/fr.svg",
    "facts": [
      "La torre Eiffel se construyó para la Exposición Universal de 1889.",
      "Es el país más visitado del mundo.",
      "El Louvre es el museo de arte más visitado del planeta.",
      "Produce cientos de tipos de queso, casi uno para cada día del año.",
      "El Tour de Francia es la carrera ciclista más famosa del mundo.",
      "El sistema métrico decimal nació en la Francia de la Revolución."
    ]
  },
  {
    "code": "ga",
    "name": "Gabón",
    "officialName": "República Gabonesa",
    "continent": "África",
    "region": "África Central",
    "capital": "Libreville",
    "population": 2593130,
    "flag": "/flags/ga.svg",
    "facts": [
      "Cerca del 88 % de su territorio está cubierto de selva tropical.",
      "Sus parques protegen gorilas, elefantes y hasta hipopótamos que nadan en el mar.",
      "El ecuador atraviesa el país por su parte central.",
      "El francés es su lengua oficial.",
      "El Parque Nacional de Loango permite ver elefantes paseando por la playa.",
      "El Nobel de la Paz Albert Schweitzer fundó un hospital en Lambaréné."
    ]
  },
  {
    "code": "gm",
    "name": "Gambia",
    "officialName": "República de Gambia",
    "continent": "África",
    "region": "África Occidental",
    "capital": "Banjul",
    "population": 2822093,
    "flag": "/flags/gm.svg",
    "facts": [
      "Es el país más pequeño del África continental.",
      "Se extiende como una estrecha franja a ambos lados del río Gambia.",
      "Está casi por completo rodeado por Senegal.",
      "Sus manglares y aves lo hacen un paraíso para los observadores de pájaros.",
      "La aldea de Juffureh inspiró la novela 'Raíces', de Alex Haley.",
      "El inglés es su lengua oficial."
    ]
  },
  {
    "code": "ge",
    "name": "Georgia",
    "officialName": "Georgia",
    "continent": "Asia",
    "region": "Asia Occidental",
    "capital": "Tiflis",
    "population": 3935766,
    "flag": "/flags/ge.svg",
    "facts": [
      "Es una de las cunas del vino, con más de 8.000 años de tradición.",
      "Se sitúa en el Cáucaso, entre Europa y Asia.",
      "Su alfabeto propio es uno de los pocos que existen en el mundo.",
      "El vino se elabora aquí en grandes tinajas de barro enterradas, los qvevri.",
      "El canto polifónico georgiano es Patrimonio Cultural de la Humanidad.",
      "Las montañas de Svaneti conservan torres de piedra medievales."
    ]
  },
  {
    "code": "gh",
    "name": "Ghana",
    "officialName": "República de Ghana",
    "continent": "África",
    "region": "África Occidental",
    "capital": "Acra",
    "population": 35064272,
    "flag": "/flags/gh.svg",
    "facts": [
      "Fue el primer país del África subsahariana en independizarse, en 1957.",
      "La estrella negra de su bandera simboliza la libertad africana.",
      "El lago Volta es uno de los mayores embalses artificiales del mundo.",
      "Sus coloridos ataúdes figurativos son toda una forma de arte funerario.",
      "El kente, tejido de vivos colores, es su tela tradicional más célebre.",
      "Fue un gran centro del comercio del oro; se llamó Costa de Oro."
    ]
  },
  {
    "code": "gd",
    "name": "Granada",
    "officialName": "Granada",
    "continent": "América del Norte",
    "region": "Caribe",
    "capital": "Saint George's",
    "population": 117303,
    "flag": "/flags/gd.svg",
    "facts": [
      "Se la conoce como 'la isla de las especias' por su nuez moscada.",
      "Su bandera muestra una nuez moscada, símbolo de su principal cultivo.",
      "Es uno de los mayores productores mundiales de nuez moscada.",
      "Su chocolate 'del árbol a la barra' se elabora con cacao de la propia isla.",
      "Tiene uno de los primeros parques de esculturas submarinas del mundo.",
      "El inglés es su idioma oficial."
    ]
  },
  {
    "code": "gr",
    "name": "Grecia",
    "officialName": "República Helénica",
    "continent": "Europa",
    "region": "Europa Meridional",
    "capital": "Atenas",
    "population": 10413962,
    "flag": "/flags/gr.svg",
    "facts": [
      "Es la cuna de la democracia y de los Juegos Olímpicos.",
      "Tiene miles de islas, aunque solo unas pocas están habitadas.",
      "El Partenón de Atenas es un símbolo de la Antigüedad clásica.",
      "El teatro occidental, con la tragedia y la comedia, nació en la Antigua Grecia.",
      "El monte Olimpo era considerado el hogar de sus dioses.",
      "Sus costas e islas suman miles de kilómetros de litoral."
    ]
  },
  {
    "code": "gt",
    "name": "Guatemala",
    "officialName": "República de Guatemala",
    "continent": "América del Norte",
    "region": "América Central",
    "capital": "Ciudad de Guatemala",
    "population": 18687881,
    "flag": "/flags/gt.svg",
    "facts": [
      "Tikal es una de las mayores ciudades de la civilización maya.",
      "El quetzal, ave de su bandera, da nombre también a su moneda.",
      "El lago de Atitlán, rodeado de volcanes, es de origen volcánico.",
      "La ciudad colonial de Antigua Guatemala está rodeada de volcanes.",
      "Sus tejidos mayas de vivos colores identifican a cada comunidad.",
      "El chocolate era una bebida sagrada para los mayas de esta región."
    ]
  },
  {
    "code": "gn",
    "name": "Guinea",
    "officialName": "República de Guinea",
    "continent": "África",
    "region": "África Occidental",
    "capital": "Conakri",
    "population": 15099727,
    "flag": "/flags/gn.svg",
    "facts": [
      "Se la apoda 'la torre de agua de África' por los ríos que nacen en sus montañas.",
      "En sus tierras altas nacen el Níger, el Senegal y el Gambia.",
      "Posee enormes reservas de bauxita, mineral del que se obtiene el aluminio.",
      "El francés es su lengua oficial.",
      "Posee algunas de las mayores reservas de bauxita del mundo.",
      "El monte Nimba, compartido con sus vecinos, es reserva Patrimonio de la Humanidad."
    ]
  },
  {
    "code": "gq",
    "name": "Guinea Ecuatorial",
    "officialName": "República de Guinea Ecuatorial",
    "continent": "África",
    "region": "África Central",
    "capital": "Malabo",
    "population": 1938431,
    "flag": "/flags/gq.svg",
    "facts": [
      "Es el único país de África con el español como lengua oficial.",
      "Su capital, Malabo, está en una isla volcánica frente a la costa.",
      "Su territorio se reparte entre el continente y varias islas.",
      "Construye una nueva capital, Ciudad de la Paz, en plena selva del interior.",
      "El español convive con el francés y el portugués como lenguas oficiales.",
      "El pico Basilé, un volcán, es su punto más alto."
    ]
  },
  {
    "code": "gw",
    "name": "Guinea-Bisáu",
    "officialName": "República de Guinea-Bisáu",
    "continent": "África",
    "region": "África Occidental",
    "capital": "Bisáu",
    "population": 2249515,
    "flag": "/flags/gw.svg",
    "facts": [
      "El archipiélago de Bijagós es reserva de la biosfera con hipopótamos de agua salada.",
      "El anacardo es su principal producto de exportación.",
      "Fue territorio portugués hasta su independencia en los años setenta.",
      "El archipiélago de Bijagós reúne 88 islas, muchas de ellas deshabitadas.",
      "El criollo portugués es la lengua franca que une a sus pueblos.",
      "El anacardo, o cajú, sostiene buena parte de su economía."
    ]
  },
  {
    "code": "gy",
    "name": "Guyana",
    "officialName": "República Cooperativa de Guyana",
    "continent": "América del Sur",
    "region": "América del Sur",
    "capital": "Georgetown",
    "population": 835986,
    "flag": "/flags/gy.svg",
    "facts": [
      "Su nombre significa 'tierra de muchas aguas'.",
      "El salto Kaieteur es una de las mayores caídas de agua de un solo salto del mundo.",
      "Es el único país de Sudamérica cuyo idioma oficial es el inglés.",
      "El salto Kaieteur es varias veces más alto que las cataratas del Niágara.",
      "Culturalmente se siente más caribeña que sudamericana.",
      "El hallazgo de petróleo frente a su costa ha disparado su economía."
    ]
  },
  {
    "code": "ht",
    "name": "Haití",
    "officialName": "República de Haití",
    "continent": "América del Norte",
    "region": "Caribe",
    "capital": "Puerto Príncipe",
    "population": 11906095,
    "flag": "/flags/ht.svg",
    "facts": [
      "Fue la primera república gobernada por antiguos esclavos, en 1804.",
      "La Ciudadela Laferrière es una de las mayores fortalezas de América.",
      "Comparte con la República Dominicana la isla La Española.",
      "El criollo haitiano y el francés son sus dos idiomas oficiales.",
      "El vudú haitiano es una religión reconocida y parte de su identidad.",
      "Ocupa la parte occidental de la isla que comparte con la República Dominicana."
    ]
  },
  {
    "code": "hn",
    "name": "Honduras",
    "officialName": "República de Honduras",
    "continent": "América del Norte",
    "region": "América Central",
    "capital": "Tegucigalpa",
    "population": 11005850,
    "flag": "/flags/hn.svg",
    "facts": [
      "Copán conserva algunas de las estelas mayas más elaboradas.",
      "Las islas de la Bahía son un destino de buceo en el arrecife mesoamericano.",
      "El término 'república bananera' se acuñó a partir de su historia exportadora de banano.",
      "La 'lluvia de peces' de Yoro es un fenómeno tan curioso como célebre.",
      "El español es su idioma oficial.",
      "Sus arrecifes forman parte del segundo mayor sistema coralino del mundo."
    ]
  },
  {
    "code": "hu",
    "name": "Hungría",
    "officialName": "Hungría",
    "continent": "Europa",
    "region": "Europa Central",
    "capital": "Budapest",
    "population": 9514251,
    "flag": "/flags/hu.svg",
    "facts": [
      "Budapest surgió de la unión de Buda y Pest, separadas por el Danubio.",
      "El lago Balatón es el mayor lago de Europa Central.",
      "El cubo de Rubik fue inventado por un húngaro.",
      "Sus balnearios termales, herencia romana y otomana, son famosos en Europa.",
      "El húngaro no se parece a las lenguas vecinas; es de raíz fino-ugria.",
      "El gulash, guiso de carne y pimentón, es su plato más internacional."
    ]
  },
  {
    "code": "in",
    "name": "India",
    "officialName": "República de la India",
    "continent": "Asia",
    "region": "Asia Meridional",
    "capital": "Nueva Delhi",
    "population": 1463865525,
    "flag": "/flags/in.svg",
    "facts": [
      "Es el país más poblado del mundo.",
      "El Taj Mahal fue construido como mausoleo por amor.",
      "El ajedrez y el número cero tienen raíces en su historia.",
      "La rueda azul de su bandera, el chakra de Ashoka, simboliza el movimiento y la ley.",
      "Es cuna de religiones como el hinduismo, el budismo y el sijismo.",
      "Su industria de cine, Bollywood, produce cientos de películas al año."
    ]
  },
  {
    "code": "id",
    "name": "Indonesia",
    "officialName": "República de Indonesia",
    "continent": "Asia",
    "region": "Sudeste Asiático",
    "capital": "Yakarta",
    "population": 285721236,
    "flag": "/flags/id.svg",
    "facts": [
      "Es el mayor archipiélago del mundo, con más de 17.000 islas.",
      "Alberga el mayor número de volcanes activos del planeta.",
      "El dragón de Komodo, el lagarto más grande del mundo, vive solo aquí.",
      "El templo budista de Borobudur es el mayor del mundo de su clase.",
      "Forma parte del Triángulo de Coral, el mar con más vida marina del planeta.",
      "En Bali, los arrozales en terraza se riegan con un sistema tradicional milenario."
    ]
  },
  {
    "code": "iq",
    "name": "Irak",
    "officialName": "República de Irak",
    "continent": "Asia",
    "region": "Asia Occidental",
    "capital": "Bagdad",
    "population": 47020774,
    "flag": "/flags/iq.svg",
    "facts": [
      "Mesopotamia, 'entre ríos', es considerada una cuna de la civilización.",
      "Aquí surgió una de las primeras formas de escritura, la cuneiforme.",
      "Los ríos Tigris y Éufrates atraviesan su territorio.",
      "Babilonia, con sus míticos jardines colgantes, se alzó en su territorio.",
      "El código de Hammurabi, de los primeros códigos legales, surgió aquí.",
      "La rueda se cuenta entre los inventos surgidos en la antigua Mesopotamia."
    ]
  },
  {
    "code": "ir",
    "name": "Irán",
    "officialName": "República Islámica de Irán",
    "continent": "Asia",
    "region": "Asia Meridional",
    "capital": "Teherán",
    "population": 92417681,
    "flag": "/flags/ir.svg",
    "facts": [
      "Fue el corazón del Imperio persa, uno de los mayores de la antigüedad.",
      "Persépolis conserva las ruinas de la capital ceremonial persa.",
      "La alfombra persa es una de sus artesanías más célebres.",
      "El azafrán iraní es uno de los más apreciados y caros del mundo.",
      "El Año Nuevo persa, el Noruz, celebra la llegada de la primavera.",
      "Sus 'torres del viento' refrescan los edificios sin electricidad."
    ]
  },
  {
    "code": "ie",
    "name": "Irlanda",
    "officialName": "Irlanda",
    "continent": "Europa",
    "region": "Europa del Norte",
    "capital": "Dublín",
    "population": 5484367,
    "flag": "/flags/ie.svg",
    "facts": [
      "Se la conoce como 'la isla esmeralda' por sus verdes paisajes.",
      "El arpa, su símbolo nacional, aparece en sus monedas y documentos.",
      "San Patricio, su patrón, se celebra en todo el mundo.",
      "El trébol de tres hojas es un emblema muy asociado al país.",
      "El irlandés, o gaélico, es lengua oficial junto al inglés.",
      "Los acantilados de Moher caen a pico sobre el Atlántico."
    ]
  },
  {
    "code": "is",
    "name": "Islandia",
    "officialName": "República de Islandia",
    "continent": "Europa",
    "region": "Europa del Norte",
    "capital": "Reikiavik",
    "population": 392404,
    "flag": "/flags/is.svg",
    "facts": [
      "Alberga el mayor glaciar de Europa y numerosos volcanes activos.",
      "Casi toda su energía procede de fuentes geotérmicas e hidráulicas.",
      "No tiene ejército y es de los países más pacíficos del mundo.",
      "La laguna azul es un balneario geotérmico de aguas lechosas y cálidas.",
      "Su parlamento, el Alþingi, es uno de los más antiguos del mundo.",
      "No usa apellidos al uso: forma el nombre a partir del padre o la madre."
    ]
  },
  {
    "code": "mh",
    "name": "Islas Marshall",
    "officialName": "República de las Islas Marshall",
    "continent": "Oceanía",
    "region": "Micronesia",
    "capital": "Majuro",
    "population": 36282,
    "flag": "/flags/mh.svg",
    "facts": [
      "Sus navegantes crearon mapas de palos para leer el oleaje del océano.",
      "El atolón Bikini fue escenario de pruebas nucleares en el siglo XX.",
      "Es una nación de atolones de coral dispersos en el Pacífico.",
      "El atolón Kwajalein rodea una de las mayores lagunas del mundo.",
      "El inglés y el marshalés son sus idiomas oficiales.",
      "Sus islas apenas se elevan un par de metros sobre el océano."
    ]
  },
  {
    "code": "sb",
    "name": "Islas Salomón",
    "officialName": "Islas Salomón",
    "continent": "Oceanía",
    "region": "Melanesia",
    "capital": "Honiara",
    "population": 838645,
    "flag": "/flags/sb.svg",
    "facts": [
      "Fue escenario de intensas batallas en la Segunda Guerra Mundial.",
      "Es un archipiélago de casi mil islas en el Pacífico.",
      "Sus aguas albergan arrecifes de coral y pecios hundidos.",
      "En algunas islas aún se usan conchas como forma tradicional de dinero.",
      "En sus islas se hablan más de 70 lenguas distintas.",
      "Tiene una notable proporción de personas de piel oscura y cabello rubio natural."
    ]
  },
  {
    "code": "il",
    "name": "Israel",
    "officialName": "Estado de Israel",
    "continent": "Asia",
    "region": "Asia Occidental",
    "capital": "Jerusalén",
    "population": 10122800,
    "flag": "/flags/il.svg",
    "facts": [
      "El mar Muerto es el punto de tierra firme más bajo del planeta.",
      "En sus aguas, tan saladas, es casi imposible hundirse.",
      "La estrella de David de su bandera es un antiguo símbolo judío.",
      "El hebreo, lengua antigua, resurgió como idioma cotidiano en el siglo XX.",
      "Jerusalén es ciudad sagrada para el judaísmo, el cristianismo y el islam.",
      "El hummus y el falafel son platos muy presentes en su gastronomía."
    ]
  },
  {
    "code": "it",
    "name": "Italia",
    "officialName": "República Italiana",
    "continent": "Europa",
    "region": "Europa Meridional",
    "capital": "Roma",
    "population": 58915656,
    "flag": "/flags/it.svg",
    "facts": [
      "Roma alberga en su interior un país entero, la Ciudad del Vaticano.",
      "Es uno de los países con más sitios Patrimonio de la Humanidad del mundo.",
      "La pizza y la pasta nacieron en su tradición culinaria.",
      "El Coliseo de Roma acogía combates de gladiadores hace casi 2.000 años.",
      "El helado artesanal, el gelato, es una de sus delicias más famosas.",
      "Venecia se levanta sobre más de un centenar de islas unidas por canales."
    ]
  },
  {
    "code": "jm",
    "name": "Jamaica",
    "officialName": "Jamaica",
    "continent": "América del Norte",
    "region": "Caribe",
    "capital": "Kingston",
    "population": 2837077,
    "flag": "/flags/jm.svg",
    "facts": [
      "Es la cuna del reggae y de Bob Marley.",
      "Su equipo de bobsleigh saltó a la fama en los Juegos de Invierno de 1988.",
      "El café Blue Mountain es uno de los más apreciados del mundo.",
      "Usain Bolt, el hombre más rápido de la historia, nació en la isla.",
      "Es uno de los pocos países cuya bandera no lleva rojo, blanco ni azul.",
      "El patois jamaicano convive con el inglés en el habla cotidiana."
    ]
  },
  {
    "code": "jp",
    "name": "Japón",
    "officialName": "Japón",
    "continent": "Asia",
    "region": "Asia Oriental",
    "capital": "Tokio",
    "population": 123366734,
    "flag": "/flags/jp.svg",
    "facts": [
      "El círculo rojo de su bandera representa al sol naciente.",
      "Es un archipiélago formado por miles de islas.",
      "Tiene una de las mayores esperanzas de vida del mundo.",
      "El monte Fuji, volcán de silueta casi perfecta, es un símbolo sagrado.",
      "El sushi y el ramen son embajadores de su cocina en todo el mundo.",
      "El tren bala, el shinkansen, circula desde 1964 con gran puntualidad."
    ]
  },
  {
    "code": "jo",
    "name": "Jordania",
    "officialName": "Reino Hachemí de Jordania",
    "continent": "Asia",
    "region": "Asia Occidental",
    "capital": "Amán",
    "population": 11520684,
    "flag": "/flags/jo.svg",
    "facts": [
      "Petra, tallada en roca rosada, es una de las nuevas siete maravillas del mundo.",
      "El mar Muerto baña su frontera occidental.",
      "El desierto de Wadi Rum ha servido de escenario a películas ambientadas en Marte.",
      "Petra fue tallada por los nabateos, un pueblo de comerciantes del desierto.",
      "El mansaf, cordero con yogur y arroz, es su plato nacional.",
      "El árabe es su idioma oficial."
    ]
  },
  {
    "code": "kz",
    "name": "Kazajistán",
    "officialName": "República de Kazajistán",
    "continent": "Asia",
    "region": "Asia Central",
    "capital": "Astaná",
    "population": 20843754,
    "flag": "/flags/kz.svg",
    "facts": [
      "Es el mayor país sin salida al mar del mundo.",
      "Desde el cosmódromo de Baikonur se lanzó el primer viaje humano al espacio.",
      "Es el noveno país más extenso del planeta.",
      "La manzana silvestre, antepasada de las cultivadas, procede de sus montañas.",
      "El águila real amaestrada se usa para cazar en las estepas.",
      "Astaná se levantó con audaz arquitectura futurista en plena estepa."
    ]
  },
  {
    "code": "ke",
    "name": "Kenia",
    "officialName": "República de Kenia",
    "continent": "África",
    "region": "África Oriental",
    "capital": "Nairobi",
    "population": 57532493,
    "flag": "/flags/ke.svg",
    "facts": [
      "La migración de ñus por el Masái Mara es uno de los mayores espectáculos naturales.",
      "Es cuna de campeones mundiales de fondo, muchos del valle del Rift.",
      "El escudo y las lanzas masái de su bandera simbolizan la defensa de la libertad.",
      "El suajili y el inglés son sus dos idiomas oficiales.",
      "El valle del Rift atraviesa el país y guarda huellas de los primeros humanos.",
      "El monte Kenia, un volcán extinto, da nombre al país."
    ]
  },
  {
    "code": "kg",
    "name": "Kirguistán",
    "officialName": "República Kirguisa",
    "continent": "Asia",
    "region": "Asia Central",
    "capital": "Biskek",
    "population": 7343064,
    "flag": "/flags/kg.svg",
    "facts": [
      "Más del 90 % de su territorio es montañoso, dominado por el Tian Shan.",
      "El lago Issyk-Kul es enorme y no se congela pese a la altitud.",
      "La epopeya de Manás es uno de los poemas orales más largos del mundo.",
      "Aún se practica la vida nómada en yurtas por sus pastos de montaña.",
      "Los Juegos Mundiales Nómadas nacieron en su territorio.",
      "El kok-boru, juego a caballo con un cuerpo de cabra, es su deporte tradicional."
    ]
  },
  {
    "code": "ki",
    "name": "Kiribati",
    "officialName": "República de Kiribati",
    "continent": "Oceanía",
    "region": "Micronesia",
    "capital": "Tarawa Sur",
    "population": 136488,
    "flag": "/flags/ki.svg",
    "facts": [
      "Es el único país que se extiende por los cuatro hemisferios a la vez.",
      "Fue el primer país en recibir el nuevo milenio en el año 2000.",
      "Sus atolones apenas se elevan sobre el nivel del mar.",
      "Su territorio marino es tan vasto como toda la India.",
      "El inglés y el gilbertés son sus lenguas de uso.",
      "Compró tierras en Fiyi ante la amenaza de la subida del mar."
    ]
  },
  {
    "code": "kw",
    "name": "Kuwait",
    "officialName": "Estado de Kuwait",
    "continent": "Asia",
    "region": "Asia Occidental",
    "capital": "Ciudad de Kuwait",
    "population": 4865298,
    "flag": "/flags/kw.svg",
    "facts": [
      "Posee algunas de las mayores reservas de petróleo del mundo.",
      "Las Torres de Kuwait son su monumento más emblemático.",
      "Su moneda, el dinar, es una de las de mayor valor del mundo.",
      "El dinar kuwaití es la unidad monetaria de mayor valor del mundo.",
      "Su costa en el golfo Pérsico tuvo una larga tradición de pesca de perlas.",
      "El árabe es su idioma oficial."
    ]
  },
  {
    "code": "la",
    "name": "Laos",
    "officialName": "República Democrática Popular Lao",
    "continent": "Asia",
    "region": "Sudeste Asiático",
    "capital": "Vientián",
    "population": 7873046,
    "flag": "/flags/la.svg",
    "facts": [
      "Es el único país sin salida al mar del Sudeste Asiático.",
      "La Llanura de las Jarras está sembrada de miles de jarras de piedra milenarias.",
      "Luang Prabang es una ciudad de templos budistas Patrimonio de la Humanidad.",
      "Cada mañana, monjes budistas recogen limosnas de arroz en procesión.",
      "El río Mekong recorre el país de norte a sur.",
      "El laosiano se escribe con un alfabeto de trazos redondeados."
    ]
  },
  {
    "code": "ls",
    "name": "Lesotho",
    "officialName": "Reino de Lesotho",
    "continent": "África",
    "region": "África Austral",
    "capital": "Maseru",
    "population": 2363325,
    "flag": "/flags/ls.svg",
    "facts": [
      "Todo su territorio está por encima de los 1.000 m de altitud, caso único.",
      "Está completamente rodeado por Sudáfrica.",
      "El sombrero tradicional basoto, el mokorotlo, aparece en su bandera.",
      "Puede nevar en sus montañas, algo poco común en esta latitud de África.",
      "El sesotho y el inglés son sus idiomas oficiales.",
      "Los pastores basotho se envuelven en gruesas mantas de vivos diseños."
    ]
  },
  {
    "code": "lv",
    "name": "Letonia",
    "officialName": "República de Letonia",
    "continent": "Europa",
    "region": "Europa del Norte",
    "capital": "Riga",
    "population": 1847785,
    "flag": "/flags/lv.svg",
    "facts": [
      "Riga tiene una de las mayores colecciones de arquitectura art nouveau de Europa.",
      "Más de la mitad del país está cubierto de bosques.",
      "Sus festivales de canto bálticos son Patrimonio de la Humanidad.",
      "Recolectar setas y bayas en el bosque en otoño es toda una tradición.",
      "El letón es una de las dos únicas lenguas bálticas que siguen vivas.",
      "Su Fiesta de la Canción reúne cada pocos años a miles de coristas."
    ]
  },
  {
    "code": "lb",
    "name": "Líbano",
    "officialName": "República Libanesa",
    "continent": "Asia",
    "region": "Asia Occidental",
    "capital": "Beirut",
    "population": 5849421,
    "flag": "/flags/lb.svg",
    "facts": [
      "El cedro de su bandera es un símbolo milenario del país.",
      "Biblos es una de las ciudades habitadas más antiguas del mundo.",
      "Su nombre aparece en textos de hace más de 4.000 años.",
      "Beirut ha sido reconstruida tantas veces que la llaman 'el ave fénix'.",
      "El árabe es su idioma oficial, con una fuerte presencia del francés.",
      "El tabulé y el hummus forman parte de su célebre mesa de mezze."
    ]
  },
  {
    "code": "lr",
    "name": "Liberia",
    "officialName": "República de Liberia",
    "continent": "África",
    "region": "África Occidental",
    "capital": "Monrovia",
    "population": 5731206,
    "flag": "/flags/lr.svg",
    "facts": [
      "Fue fundada por esclavos afroamericanos liberados en el siglo XIX.",
      "Su bandera de barras y una estrella se inspira en la de Estados Unidos.",
      "Su capital, Monrovia, honra al presidente estadounidense James Monroe.",
      "Es una de las repúblicas más antiguas de África, independiente desde 1847.",
      "El inglés es su idioma oficial.",
      "Registra muchos barcos del mundo bajo su bandera de conveniencia."
    ]
  },
  {
    "code": "ly",
    "name": "Libia",
    "officialName": "Estado de Libia",
    "continent": "África",
    "region": "África del Norte",
    "capital": "Trípoli",
    "population": 7458555,
    "flag": "/flags/ly.svg",
    "facts": [
      "Más del 90 % de su territorio es desierto del Sáhara.",
      "El Gran Río Artificial transporta agua fósil bajo el desierto.",
      "Leptis Magna conserva unas de las mejores ruinas romanas del Mediterráneo.",
      "El árabe es su idioma oficial.",
      "Tiene la mayor reserva de petróleo de África.",
      "Ghadamés, 'la perla del desierto', es una ciudad oasis Patrimonio de la Humanidad."
    ]
  },
  {
    "code": "li",
    "name": "Liechtenstein",
    "officialName": "Principado de Liechtenstein",
    "continent": "Europa",
    "region": "Europa Occidental",
    "capital": "Vaduz",
    "population": 41024,
    "flag": "/flags/li.svg",
    "facts": [
      "Es uno de los dos únicos países del mundo doblemente sin salida al mar.",
      "Es un gran productor mundial de dentaduras postizas.",
      "No tiene aeropuerto y se sitúa entre Suiza y Austria.",
      "Se puede alquilar el país entero para eventos, según una curiosa iniciativa.",
      "Su príncipe reside en un castillo que domina la capital, Vaduz.",
      "Comparte su moneda, el franco suizo, con Suiza."
    ]
  },
  {
    "code": "lt",
    "name": "Lituania",
    "officialName": "República de Lituania",
    "continent": "Europa",
    "region": "Europa del Norte",
    "capital": "Vilna",
    "population": 2888774,
    "flag": "/flags/lt.svg",
    "facts": [
      "Fue el último país pagano de Europa en cristianizarse.",
      "La Colina de las Cruces reúne cientos de miles de cruces.",
      "El ámbar del Báltico es una de sus señas de identidad.",
      "Tiene un aroma nacional propio, creado como perfume oficial del país.",
      "Su plato estrella, el cepelinai, son bolas de patata rellenas de carne.",
      "El baloncesto es casi una religión y su selección brilla en Europa."
    ]
  },
  {
    "code": "lu",
    "name": "Luxemburgo",
    "officialName": "Gran Ducado de Luxemburgo",
    "continent": "Europa",
    "region": "Europa Occidental",
    "capital": "Luxemburgo",
    "population": 686970,
    "flag": "/flags/lu.svg",
    "facts": [
      "Es uno de los estados más ricos del mundo por renta per cápita.",
      "Su capital, con fortificaciones sobre acantilados, es Patrimonio de la Humanidad.",
      "Tiene tres idiomas oficiales: luxemburgués, francés y alemán.",
      "Ofrece transporte público gratuito en todo el país, un caso pionero.",
      "Es uno de los seis estados fundadores de la Unión Europea.",
      "Alberga instituciones como el Tribunal de Justicia de la Unión Europea."
    ]
  },
  {
    "code": "mk",
    "name": "Macedonia del Norte",
    "officialName": "República de Macedonia del Norte",
    "continent": "Europa",
    "region": "Europa Sudoriental",
    "capital": "Skopie",
    "population": 1820909,
    "flag": "/flags/mk.svg",
    "facts": [
      "El lago Ohrid es uno de los lagos más antiguos y profundos de Europa.",
      "Skopie es la ciudad natal de la Madre Teresa.",
      "Cambió su nombre a Macedonia del Norte en 2019.",
      "El lago Ohrid alberga especies de peces que no existen en ningún otro lugar.",
      "El macedonio se escribe con el alfabeto cirílico.",
      "Sus montañas guardan monasterios y frescos medievales muy valiosos."
    ]
  },
  {
    "code": "mg",
    "name": "Madagascar",
    "officialName": "República de Madagascar",
    "continent": "África",
    "region": "África Oriental",
    "capital": "Antananarivo",
    "population": 32740678,
    "flag": "/flags/mg.svg",
    "facts": [
      "Cerca del 90 % de su fauna, como los lémures, no existe en ningún otro lugar.",
      "Es la cuarta isla más grande del mundo.",
      "La vainilla es uno de sus principales productos de exportación.",
      "Los baobabs, de tronco descomunal, forman avenidas espectaculares.",
      "El malgache, su idioma, tiene raíces en lenguas del Sudeste Asiático.",
      "Es el mayor productor mundial de vainilla natural."
    ]
  },
  {
    "code": "my",
    "name": "Malasia",
    "officialName": "Malasia",
    "continent": "Asia",
    "region": "Sudeste Asiático",
    "capital": "Kuala Lumpur",
    "population": 35977838,
    "flag": "/flags/my.svg",
    "facts": [
      "Las Torres Petronas fueron los edificios más altos del mundo hasta 2004.",
      "Su selva es una de las más antiguas del planeta, con más de 130 millones de años.",
      "Es uno de los pocos hogares del orangután, junto a Indonesia.",
      "El rey rota entre nueve sultanes cada cinco años, un sistema único.",
      "La flor rafflesia, la mayor del mundo, florece en sus selvas.",
      "Su cocina mezcla sabores malayos, chinos e indios."
    ]
  },
  {
    "code": "mw",
    "name": "Malawi",
    "officialName": "República de Malawi",
    "continent": "África",
    "region": "África Oriental",
    "capital": "Lilongüe",
    "population": 22216120,
    "flag": "/flags/mw.svg",
    "facts": [
      "El lago Malawi alberga cientos de especies de peces cíclidos únicos en el mundo.",
      "Se le conoce como 'el cálido corazón de África' por la hospitalidad de su gente.",
      "El lago ocupa cerca de un tercio de la superficie del país.",
      "El lago Malawi es tan grande que parece un mar interior.",
      "El chichewa y el inglés son sus idiomas oficiales.",
      "Bucear en agua dulce entre peces de colores es una de sus atracciones."
    ]
  },
  {
    "code": "mv",
    "name": "Maldivas",
    "officialName": "República de Maldivas",
    "continent": "Asia",
    "region": "Asia Meridional",
    "capital": "Malé",
    "population": 529676,
    "flag": "/flags/mv.svg",
    "facts": [
      "Es el país más plano del mundo: su punto más alto apenas supera los 2 m.",
      "Está formado por más de 1.000 islas de coral agrupadas en atolones.",
      "Es una de las naciones más amenazadas por la subida del nivel del mar.",
      "Celebró un consejo de ministros bajo el agua para alertar del cambio climático.",
      "Muchos de sus hoteles ocupan una isla entera cada uno.",
      "El divehi es su idioma y se escribe de derecha a izquierda."
    ]
  },
  {
    "code": "ml",
    "name": "Malí",
    "officialName": "República de Malí",
    "continent": "África",
    "region": "África Occidental",
    "capital": "Bamako",
    "population": 25198821,
    "flag": "/flags/ml.svg",
    "facts": [
      "Tombuctú fue un legendario centro de saber y de comercio del oro.",
      "El Imperio de Malí y su rey Mansa Musa fueron célebres por su riqueza.",
      "La Gran Mezquita de Yenné es el mayor edificio de adobe del mundo.",
      "El norte acogió un célebre festival de música en pleno desierto.",
      "La kora, un arpa de 21 cuerdas, dio a conocer su música en el mundo.",
      "El río Níger describe un gran arco por el país y sostiene la vida en el Sahel."
    ]
  },
  {
    "code": "mt",
    "name": "Malta",
    "officialName": "República de Malta",
    "continent": "Europa",
    "region": "Europa Meridional",
    "capital": "La Valeta",
    "population": 579704,
    "flag": "/flags/mt.svg",
    "facts": [
      "Sus templos megalíticos son más antiguos que las pirámides de Egipto.",
      "Es uno de los países más pequeños y densamente poblados del mundo.",
      "Fue hogar de la orden de los Caballeros de Malta.",
      "El maltés, mezcla de árabe e italiano, es la única lengua semítica oficial de la UE.",
      "Sus calas de aguas cristalinas atraen a buceadores de toda Europa.",
      "La Valeta se construyó como ciudad fortaleza tras un gran asedio."
    ]
  },
  {
    "code": "ma",
    "name": "Marruecos",
    "officialName": "Reino de Marruecos",
    "continent": "África",
    "region": "África del Norte",
    "capital": "Rabat",
    "population": 38430770,
    "flag": "/flags/ma.svg",
    "facts": [
      "La estrella verde de su bandera es el sello de Salomón.",
      "Fez alberga una de las universidades más antiguas del mundo aún en activo.",
      "Reúne desierto, costa atlántica y las cumbres del Atlas en un solo país.",
      "Los zocos de Marrakech y Fez son laberintos de comercio y artesanía.",
      "El tajín, guiso cocinado en olla de barro cónica, es su plato emblema.",
      "El árabe y el tamazight, o bereber, son sus lenguas oficiales."
    ]
  },
  {
    "code": "mu",
    "name": "Mauricio",
    "officialName": "República de Mauricio",
    "continent": "África",
    "region": "África Oriental",
    "capital": "Port Louis",
    "population": 1243741,
    "flag": "/flags/mu.svg",
    "facts": [
      "Fue el hogar del dodo, ave no voladora extinta en el siglo XVII.",
      "Su bandera de cuatro franjas horizontales es una de las pocas así del mundo.",
      "Reúne culturas india, africana, china y europea en una sola isla.",
      "Una 'cascada submarina' es en realidad una ilusión óptica de arena y corrientes.",
      "El criollo mauriciano lo habla la mayoría, junto al francés y el inglés.",
      "Mark Twain escribió que el cielo parecía copiado de Mauricio."
    ]
  },
  {
    "code": "mr",
    "name": "Mauritania",
    "officialName": "República Islámica de Mauritania",
    "continent": "África",
    "region": "África Occidental",
    "capital": "Nuakchot",
    "population": 5315065,
    "flag": "/flags/mr.svg",
    "facts": [
      "El 'ojo del Sáhara', una formación circular gigante, se ve desde el espacio.",
      "Uno de los trenes más largos del mundo transporta hierro por su desierto.",
      "Gran parte del país está cubierta por el Sáhara.",
      "Uno de sus trenes de mineral de hierro supera los 2 km de longitud.",
      "Las bibliotecas medievales de Chinguetti guardan manuscritos antiguos.",
      "El árabe es su idioma oficial."
    ]
  },
  {
    "code": "mx",
    "name": "México",
    "officialName": "Estados Unidos Mexicanos",
    "continent": "América del Norte",
    "region": "América del Norte",
    "capital": "Ciudad de México",
    "population": 131946900,
    "flag": "/flags/mx.svg",
    "facts": [
      "El águila devorando una serpiente de su bandera procede de una leyenda azteca.",
      "Es el país con más sitios Patrimonio de la Humanidad de América.",
      "El maíz, el chile y el cacao se cultivaron aquí por primera vez.",
      "El Día de Muertos, con sus altares y calaveras, es Patrimonio Cultural de la Humanidad.",
      "Chichén Itzá, con su pirámide de Kukulcán, es una maravilla del mundo maya.",
      "La mariposa monarca migra por millones a sus bosques cada año."
    ]
  },
  {
    "code": "fm",
    "name": "Micronesia",
    "officialName": "Estados Federados de Micronesia",
    "continent": "Oceanía",
    "region": "Micronesia",
    "capital": "Palikir",
    "population": 113683,
    "flag": "/flags/fm.svg",
    "facts": [
      "La ciudad de Nan Madol se construyó sobre un centenar de islotes artificiales.",
      "Está formada por cientos de islas en el Pacífico occidental.",
      "En Yap se usaron enormes monedas de piedra como dinero.",
      "Las piedras rai de Yap podían medir varios metros y no se movían de sitio.",
      "Está formada por cuatro estados repartidos por el Pacífico occidental.",
      "Sus lagunas guardan restos de barcos hundidos en la Segunda Guerra Mundial."
    ]
  },
  {
    "code": "md",
    "name": "Moldavia",
    "officialName": "República de Moldavia",
    "continent": "Europa",
    "region": "Europa Oriental",
    "capital": "Chisináu",
    "population": 2360527,
    "flag": "/flags/md.svg",
    "facts": [
      "Alberga la mayor bodega de vino del mundo, con túneles kilométricos.",
      "El vino es una parte central de su economía y su cultura.",
      "Es uno de los países menos visitados de Europa.",
      "Sus bodegas de Mileștii Mici guardan millones de botellas en túneles kilométricos.",
      "El rumano, aquí llamado moldavo, es su idioma oficial.",
      "Es uno de los países más rurales de Europa."
    ]
  },
  {
    "code": "mc",
    "name": "Mónaco",
    "officialName": "Principado de Mónaco",
    "continent": "Europa",
    "region": "Europa Occidental",
    "capital": "Mónaco",
    "population": 38341,
    "flag": "/flags/mc.svg",
    "facts": [
      "Es el segundo país más pequeño del mundo tras el Vaticano.",
      "Acoge cada año el Gran Premio de Fórmula 1 por sus calles.",
      "Es uno de los países con mayor densidad de población del mundo.",
      "Su casino de Montecarlo es uno de los más famosos del mundo.",
      "Cabe casi entero en el recinto de muchos grandes parques urbanos.",
      "No cobra impuesto sobre la renta a sus residentes."
    ]
  },
  {
    "code": "mn",
    "name": "Mongolia",
    "officialName": "Mongolia",
    "continent": "Asia",
    "region": "Asia Oriental",
    "capital": "Ulán Bator",
    "population": 3568978,
    "flag": "/flags/mn.svg",
    "facts": [
      "Tiene la menor densidad de población de todos los países del mundo.",
      "Gengis Kan fundó aquí el mayor imperio contiguo de la historia.",
      "El desierto de Gobi es rico en fósiles de dinosaurios.",
      "El festival Naadam reúne lucha, tiro con arco y carreras de caballos.",
      "Muchos aún viven en gers, tiendas de fieltro fáciles de trasladar.",
      "Su capital, Ulán Bator, es una de las más frías del mundo."
    ]
  },
  {
    "code": "me",
    "name": "Montenegro",
    "officialName": "Montenegro",
    "continent": "Europa",
    "region": "Europa Sudoriental",
    "capital": "Podgorica",
    "population": 623129,
    "flag": "/flags/me.svg",
    "facts": [
      "Su nombre significa 'montaña negra'.",
      "La bahía de Kotor parece un fiordo mediterráneo rodeado de montañas.",
      "Es uno de los países más jóvenes de Europa: se independizó en 2006.",
      "El monasterio de Ostrog está incrustado en un acantilado vertical.",
      "Su costa adriática combina playas con pueblos medievales amurallados.",
      "El lago Skadar es el mayor de los Balcanes y refugio de aves."
    ]
  },
  {
    "code": "mz",
    "name": "Mozambique",
    "officialName": "República de Mozambique",
    "continent": "África",
    "region": "África Oriental",
    "capital": "Maputo",
    "population": 35631653,
    "flag": "/flags/mz.svg",
    "facts": [
      "Es el único país cuya bandera muestra un fusil moderno, un AK-47.",
      "Su costa en el Índico supera los 2.500 km de playas y arrecifes.",
      "El portugués es su lengua oficial, herencia del pasado colonial.",
      "La isla de Mozambique, antigua capital, es Patrimonio de la Humanidad.",
      "El archipiélago de Bazaruto es refugio del dugongo, un manatí marino.",
      "La marrabenta es su ritmo musical más característico."
    ]
  },
  {
    "code": "mm",
    "name": "Myanmar",
    "officialName": "República de la Unión de Myanmar",
    "continent": "Asia",
    "region": "Sudeste Asiático",
    "capital": "Naipyidó",
    "population": 54850648,
    "flag": "/flags/mm.svg",
    "facts": [
      "La pagoda Shwedagon de Rangún está recubierta de láminas de oro.",
      "Bagan reúne miles de templos budistas en una gran llanura.",
      "También se conoce por su antiguo nombre, Birmania.",
      "Muchos se aplican thanaka, una pasta amarilla, en el rostro para protegerse del sol.",
      "El lago Inle es famoso por sus pescadores que reman con una pierna.",
      "El birmano se escribe con un alfabeto de letras muy redondeadas."
    ]
  },
  {
    "code": "na",
    "name": "Namibia",
    "officialName": "República de Namibia",
    "continent": "África",
    "region": "África Austral",
    "capital": "Windhoek",
    "population": 3092816,
    "flag": "/flags/na.svg",
    "facts": [
      "El desierto del Namib, que le da nombre, es uno de los más antiguos del mundo.",
      "Las dunas de Sossusvlei figuran entre las más altas del planeta.",
      "La Costa de los Esqueletos debe su nombre a los naufragios y huesos de ballena.",
      "Fue el primer país en incluir la protección del medio ambiente en su constitución.",
      "El pueblo himba se recubre la piel de ocre rojo.",
      "En el Namib, algunas dunas caen directamente sobre el océano."
    ]
  },
  {
    "code": "nr",
    "name": "Nauru",
    "officialName": "República de Nauru",
    "continent": "Oceanía",
    "region": "Micronesia",
    "capital": "Yaren",
    "population": 12025,
    "flag": "/flags/nr.svg",
    "facts": [
      "Es el país insular más pequeño del mundo.",
      "No tiene capital oficial; las oficinas de gobierno están en el distrito de Yaren.",
      "Su riqueza provino de las reservas de fosfato de guano de ave.",
      "Se puede dar la vuelta completa a la isla en coche en menos de media hora.",
      "Su único aeropuerto ocupa una franja junto a la costa.",
      "La minería del fosfato dejó gran parte de su interior sin vegetación."
    ]
  },
  {
    "code": "np",
    "name": "Nepal",
    "officialName": "República Democrática Federal de Nepal",
    "continent": "Asia",
    "region": "Asia Meridional",
    "capital": "Katmandú",
    "population": 29618118,
    "flag": "/flags/np.svg",
    "facts": [
      "Alberga el Everest, la montaña más alta del mundo.",
      "Es el único país con una bandera que no es rectangular.",
      "Es la cuna de Buda, nacido en Lumbini.",
      "Ocho de las diez montañas más altas del mundo se alzan en su territorio.",
      "Los sherpas son célebres guías y porteadores de altura del Himalaya.",
      "En su bandera, el sol y la luna simbolizan que el país durará como los astros."
    ]
  },
  {
    "code": "ni",
    "name": "Nicaragua",
    "officialName": "República de Nicaragua",
    "continent": "América del Norte",
    "region": "América Central",
    "capital": "Managua",
    "population": 7007502,
    "flag": "/flags/ni.svg",
    "facts": [
      "El lago Cocibolca es el mayor de Centroamérica y tiene tiburones de agua dulce.",
      "Se la conoce como 'la tierra de lagos y volcanes'.",
      "La isla de Ometepe está formada por dos volcanes unidos.",
      "Bajar en tabla por las laderas del volcán Cerro Negro es una atracción única.",
      "Granada y León conservan una bella arquitectura colonial.",
      "El español es oficial, con lenguas indígenas en la costa caribeña."
    ]
  },
  {
    "code": "ne",
    "name": "Níger",
    "officialName": "República del Níger",
    "continent": "África",
    "region": "África Occidental",
    "capital": "Niamey",
    "population": 27917831,
    "flag": "/flags/ne.svg",
    "facts": [
      "Debe su nombre al río Níger, que cruza su suroeste.",
      "El desierto del Ténéré albergó el 'árbol del Ténéré', antaño el más aislado del mundo.",
      "Sus reservas de uranio están entre las mayores de África.",
      "En Agadez, una gran mezquita de adobe domina una ciudad del desierto.",
      "En su desierto se hallaron fósiles de dinosaurios como el Nigersaurus.",
      "El pueblo wodaabe celebra un festival donde los hombres compiten por su belleza."
    ]
  },
  {
    "code": "ng",
    "name": "Nigeria",
    "officialName": "República Federal de Nigeria",
    "continent": "África",
    "region": "África Occidental",
    "capital": "Abuya",
    "population": 237527782,
    "flag": "/flags/ng.svg",
    "facts": [
      "Es el país más poblado de África, con más de 200 millones de habitantes.",
      "Nollywood es una de las mayores industrias de cine del mundo por número de títulos.",
      "En su territorio se hablan más de 500 lenguas.",
      "El afrobeats nigeriano suena hoy en las listas de éxitos de todo el mundo.",
      "Lagos es una de las mayores y más pujantes ciudades de África.",
      "Wole Soyinka fue el primer africano en ganar el Nobel de Literatura."
    ]
  },
  {
    "code": "no",
    "name": "Noruega",
    "officialName": "Reino de Noruega",
    "continent": "Europa",
    "region": "Europa del Norte",
    "capital": "Oslo",
    "population": 5610870,
    "flag": "/flags/no.svg",
    "facts": [
      "Sus fiordos, tallados por glaciares, están entre los paisajes más famosos del mundo.",
      "En su extremo norte, el sol de medianoche no se pone en verano.",
      "Fue cuna de los vikingos y de grandes exploradores polares.",
      "El túnel de Lærdal es uno de los más largos del mundo para vehículos.",
      "El salmón noruego se exporta a cocinas de todo el planeta.",
      "Guarda millones de semillas del mundo en un búnker helado de Svalbard."
    ]
  },
  {
    "code": "nz",
    "name": "Nueva Zelanda",
    "officialName": "Nueva Zelanda",
    "continent": "Oceanía",
    "region": "Australia y Nueva Zelanda",
    "capital": "Wellington",
    "population": 5324700,
    "flag": "/flags/nz.svg",
    "facts": [
      "Fue el primer país del mundo en reconocer el voto femenino, en 1893.",
      "El kiwi, ave no voladora, es su símbolo nacional.",
      "Sus paisajes fueron escenario de la saga 'El Señor de los Anillos'.",
      "La haka, danza ceremonial maorí, precede a los partidos de sus 'All Blacks'.",
      "Tiene más ovejas que personas, varias por habitante.",
      "El maorí y la lengua de signos son idiomas oficiales junto al inglés."
    ]
  },
  {
    "code": "om",
    "name": "Omán",
    "officialName": "Sultanato de Omán",
    "continent": "Asia",
    "region": "Asia Occidental",
    "capital": "Mascate",
    "population": 5494691,
    "flag": "/flags/om.svg",
    "facts": [
      "Es uno de los mayores productores mundiales de incienso.",
      "Sus fuertes y castillos defensivos salpican todo el país.",
      "El sistema de riego 'falaj' tiene miles de años de antigüedad.",
      "El khanjar, una daga curva, aparece en su emblema nacional.",
      "Cada verano, un monzón cubre de verde las montañas de Dhofar.",
      "Sus wadis esconden pozas de agua turquesa entre las rocas del desierto."
    ]
  },
  {
    "code": "nl",
    "name": "Países Bajos",
    "officialName": "Reino de los Países Bajos",
    "continent": "Europa",
    "region": "Europa Occidental",
    "capital": "Ámsterdam",
    "population": 18087633,
    "flag": "/flags/nl.svg",
    "facts": [
      "Buena parte del país está por debajo del nivel del mar.",
      "Es uno de los mayores exportadores de flores, sobre todo tulipanes.",
      "Ámsterdam es la capital, pero el gobierno reside en La Haya.",
      "Sus molinos de viento drenaban el agua para ganar tierra al mar.",
      "Es uno de los países con más bicicletas por habitante del mundo.",
      "Sus pólderes son tierras arrebatadas al mar tras siglos de ingeniería."
    ]
  },
  {
    "code": "pk",
    "name": "Pakistán",
    "officialName": "República Islámica de Pakistán",
    "continent": "Asia",
    "region": "Asia Meridional",
    "capital": "Islamabad",
    "population": 255219554,
    "flag": "/flags/pk.svg",
    "facts": [
      "El K2 es la segunda montaña más alta del mundo.",
      "El valle del Indo albergó una de las primeras civilizaciones urbanas.",
      "Su sistema de regadío es uno de los mayores del mundo.",
      "El paso de Jáiber ha sido una ruta histórica entre Asia Central y el sur.",
      "Tiene algunos de los mayores glaciares fuera de las zonas polares.",
      "El urdu es su lengua nacional, aunque se hablan decenas de idiomas."
    ]
  },
  {
    "code": "pw",
    "name": "Palau",
    "officialName": "República de Palau",
    "continent": "Oceanía",
    "region": "Micronesia",
    "capital": "Ngerulmud",
    "population": 17663,
    "flag": "/flags/pw.svg",
    "facts": [
      "El Lago de las Medusas alberga millones de medusas que apenas pican.",
      "Fue de los primeros países en crear un gran santuario marino de tiburones.",
      "Su capital, Ngerulmud, es una de las menos pobladas del mundo.",
      "Prohibió las cremas solares dañinas para proteger sus corales.",
      "Los visitantes firman un juramento ecológico al entrar en el país.",
      "Sus 'islas de las rocas', verdes y redondeadas, son Patrimonio de la Humanidad."
    ]
  },
  {
    "code": "pa",
    "name": "Panamá",
    "officialName": "República de Panamá",
    "continent": "América del Norte",
    "region": "América Central",
    "capital": "Ciudad de Panamá",
    "population": 4571189,
    "flag": "/flags/pa.svg",
    "facts": [
      "El canal de Panamá conecta los océanos Atlántico y Pacífico.",
      "Por su forma curva, el sol puede salir sobre el Pacífico y ponerse en el Atlántico.",
      "Su istmo une América del Norte y América del Sur.",
      "Los barcos pagan peajes según su tamaño para cruzar el canal.",
      "El pueblo guna teje las coloridas 'molas' con capas de tela.",
      "Su moneda comparte curso legal con el dólar estadounidense."
    ]
  },
  {
    "code": "pg",
    "name": "Papúa Nueva Guinea",
    "officialName": "Estado Independiente de Papúa Nueva Guinea",
    "continent": "Oceanía",
    "region": "Melanesia",
    "capital": "Puerto Moresby",
    "population": 10762817,
    "flag": "/flags/pg.svg",
    "facts": [
      "Es el país con mayor diversidad lingüística: más de 800 lenguas.",
      "Ocupa la mitad oriental de Nueva Guinea, la segunda isla más grande del mundo.",
      "Alberga aves del paraíso de plumaje espectacular.",
      "Un ave del paraíso adorna su bandera junto a la Cruz del Sur.",
      "Algunas de sus tribus tuvieron contacto con el exterior hace muy poco tiempo.",
      "Sus tierras altas fueron desconocidas para el mundo exterior hasta el siglo XX."
    ]
  },
  {
    "code": "py",
    "name": "Paraguay",
    "officialName": "República del Paraguay",
    "continent": "América del Sur",
    "region": "América del Sur",
    "capital": "Asunción",
    "population": 7013078,
    "flag": "/flags/py.svg",
    "facts": [
      "Es uno de los dos países sin salida al mar de Sudamérica.",
      "El guaraní es idioma oficial junto al español y lo habla casi toda la población.",
      "La represa de Itaipú, que comparte con Brasil, es una de las mayores del mundo.",
      "El tereré, mate frío con hierbas, se toma para combatir el calor.",
      "El ñandutí es un delicado encaje que imita telarañas.",
      "El arpa paraguaya es su instrumento nacional."
    ]
  },
  {
    "code": "pe",
    "name": "Perú",
    "officialName": "República del Perú",
    "continent": "América del Sur",
    "region": "América del Sur",
    "capital": "Lima",
    "population": 34576665,
    "flag": "/flags/pe.svg",
    "facts": [
      "Machu Picchu es la ciudadela inca más famosa del mundo.",
      "La papa se domesticó en sus Andes, con miles de variedades.",
      "Comparte con Bolivia el lago Titicaca, el navegable más alto del mundo.",
      "Las líneas de Nazca son enormes figuras solo visibles desde el aire.",
      "El ceviche, pescado marinado en limón, es su plato bandera.",
      "El Imperio inca tuvo en Cuzco su capital y centro del mundo andino."
    ]
  },
  {
    "code": "pl",
    "name": "Polonia",
    "officialName": "República de Polonia",
    "continent": "Europa",
    "region": "Europa Central",
    "capital": "Varsovia",
    "population": 36435861,
    "flag": "/flags/pl.svg",
    "facts": [
      "El bosque de Białowieża alberga los últimos bisontes europeos en libertad.",
      "La mina de sal de Wieliczka tiene capillas talladas en la propia sal.",
      "Marie Curie, dos veces premio Nobel, nació en Varsovia.",
      "El astrónomo Copérnico, que situó al Sol en el centro, era polaco.",
      "Los pierogi, empanadillas rellenas, son uno de sus platos más queridos.",
      "Chopin, maestro del piano romántico, nació cerca de Varsovia."
    ]
  },
  {
    "code": "pt",
    "name": "Portugal",
    "officialName": "República Portuguesa",
    "continent": "Europa",
    "region": "Europa Meridional",
    "capital": "Lisboa",
    "population": 10804871,
    "flag": "/flags/pt.svg",
    "facts": [
      "Lisboa es más antigua que Roma, una de las capitales más veteranas de Europa.",
      "Fue una gran potencia de la era de los descubrimientos marítimos.",
      "El corcho, del alcornoque, es uno de sus productos más típicos.",
      "El fado, canto melancólico, es Patrimonio Cultural de la Humanidad.",
      "Es el mayor productor mundial de corcho.",
      "Los pasteles de nata, dulces de crema, nacieron en un monasterio de Lisboa."
    ]
  },
  {
    "code": "gb",
    "name": "Reino Unido",
    "officialName": "Reino Unido de Gran Bretaña e Irlanda del Norte",
    "continent": "Europa",
    "region": "Europa del Norte",
    "capital": "Londres",
    "population": 69487000,
    "flag": "/flags/gb.svg",
    "facts": [
      "Su bandera, la Union Jack, combina las cruces de Inglaterra, Escocia e Irlanda.",
      "Londres es la única ciudad que ha acogido tres veces los Juegos Olímpicos de verano.",
      "El meridiano cero pasa por el observatorio de Greenwich.",
      "El fútbol moderno se codificó en Inglaterra en el siglo XIX.",
      "El metro de Londres, 'the Tube', fue el primer subterráneo del mundo.",
      "Shakespeare, uno de los mayores dramaturgos, escribió en su lengua."
    ]
  },
  {
    "code": "cf",
    "name": "República Centroafricana",
    "officialName": "República Centroafricana",
    "continent": "África",
    "region": "África Central",
    "capital": "Bangui",
    "population": 5513282,
    "flag": "/flags/cf.svg",
    "facts": [
      "Su bandera une los colores panafricanos y los de Francia con una franja roja.",
      "Sus selvas albergan elefantes de bosque y gorilas.",
      "El río Ubangui marca gran parte de su frontera sur.",
      "El sango y el francés son sus idiomas oficiales.",
      "En Dzanga-Sangha, elefantes de bosque se reúnen en grandes claros de selva.",
      "El río Ubangui es un afluente clave del gran río Congo."
    ]
  },
  {
    "code": "cz",
    "name": "República Checa",
    "officialName": "República Checa",
    "continent": "Europa",
    "region": "Europa Central",
    "capital": "Praga",
    "population": 10886878,
    "flag": "/flags/cz.svg",
    "facts": [
      "Praga es célebre por su casco antiguo y su reloj astronómico medieval.",
      "Es uno de los mayores consumidores de cerveza per cápita del mundo.",
      "El azúcar en terrón se inventó aquí en el siglo XIX.",
      "La palabra 'robot' nació en una obra de teatro checa de 1920.",
      "La cerveza pilsner, creada en Plzeň, inspiró a las rubias de todo el mundo.",
      "Praga se libró de los bombardeos y conserva siglos de arquitectura intactos."
    ]
  },
  {
    "code": "cg",
    "name": "República del Congo",
    "officialName": "República del Congo",
    "continent": "África",
    "region": "África Central",
    "capital": "Brazzaville",
    "population": 6484437,
    "flag": "/flags/cg.svg",
    "facts": [
      "Brazzaville y Kinshasa son las capitales más cercanas del mundo, frente a frente.",
      "La selva del Congo es el segundo gran pulmón verde del planeta tras el Amazonas.",
      "El río Congo es el más profundo del mundo.",
      "El francés es su lengua oficial.",
      "Los 'sapeurs' visten con elegancia extrema como forma de arte y orgullo.",
      "Sus selvas albergan gorilas de llanura occidental."
    ]
  },
  {
    "code": "cd",
    "name": "República Democrática del Congo",
    "officialName": "República Democrática del Congo",
    "continent": "África",
    "region": "África Central",
    "capital": "Kinshasa",
    "population": 112832473,
    "flag": "/flags/cd.svg",
    "facts": [
      "Es el país más extenso del África subsahariana.",
      "El río Congo es el segundo más caudaloso del mundo tras el Amazonas.",
      "El Parque Nacional de Virunga protege a los últimos gorilas de montaña.",
      "El francés es oficial, con el lingala y el suajili muy extendidos.",
      "La rumba congoleña es Patrimonio Cultural de la Humanidad.",
      "Sus minas aportan buena parte del cobalto del mundo, clave para las baterías."
    ]
  },
  {
    "code": "do",
    "name": "República Dominicana",
    "officialName": "República Dominicana",
    "continent": "América del Norte",
    "region": "Caribe",
    "capital": "Santo Domingo",
    "population": 11520487,
    "flag": "/flags/do.svg",
    "facts": [
      "Santo Domingo fue la primera ciudad europea permanente de América.",
      "Comparte con Haití la isla La Española.",
      "El merengue y la bachata nacieron en su territorio.",
      "El pico Duarte es la cima más alta de todo el Caribe.",
      "El ámbar dominicano puede guardar insectos atrapados hace millones de años.",
      "El béisbol es su gran pasión y cantera de estrellas mundiales."
    ]
  },
  {
    "code": "rw",
    "name": "Ruanda",
    "officialName": "República de Ruanda",
    "continent": "África",
    "region": "África Oriental",
    "capital": "Kigali",
    "population": 14569341,
    "flag": "/flags/rw.svg",
    "facts": [
      "Se la conoce como 'el país de las mil colinas' por su relieve montañoso.",
      "Kigali es considerada una de las ciudades más limpias de África.",
      "Alberga gorilas de montaña en el Parque Nacional de los Volcanes.",
      "Prohibió las bolsas de plástico mucho antes que la mayoría de países.",
      "Una vez al mes, la jornada 'umuganda' reúne a la gente para trabajos comunitarios.",
      "El kiñaruanda es la lengua que habla casi toda la población."
    ]
  },
  {
    "code": "ro",
    "name": "Rumanía",
    "officialName": "Rumanía",
    "continent": "Europa",
    "region": "Europa Sudoriental",
    "capital": "Bucarest",
    "population": 19020271,
    "flag": "/flags/ro.svg",
    "facts": [
      "El castillo de Bran se asocia a la leyenda del conde Drácula.",
      "El delta del Danubio es uno de los humedales mejor conservados de Europa.",
      "Los Cárpatos albergan una de las mayores poblaciones de osos pardos de Europa.",
      "El rumano es la lengua latina más oriental de Europa.",
      "Los tejados de Sibiu tienen ventanas que parecen 'ojos que vigilan'.",
      "Timișoara fue de las primeras ciudades de Europa con alumbrado eléctrico."
    ]
  },
  {
    "code": "ru",
    "name": "Rusia",
    "officialName": "Federación de Rusia",
    "continent": "Europa",
    "region": "Europa Oriental",
    "capital": "Moscú",
    "population": 143513328,
    "flag": "/flags/ru.svg",
    "facts": [
      "Es el país más extenso del mundo y abarca once husos horarios.",
      "El lago Baikal es el más profundo y antiguo del planeta.",
      "El Transiberiano es la línea de ferrocarril más larga del mundo.",
      "La catedral de San Basilio, de cúpulas de colores, preside la Plaza Roja.",
      "Lanzó el primer satélite artificial y envió al primer humano al espacio.",
      "El ballet ruso, con el Bolshói, es una referencia mundial."
    ]
  },
  {
    "code": "ws",
    "name": "Samoa",
    "officialName": "Estado Independiente de Samoa",
    "continent": "Oceanía",
    "region": "Polinesia",
    "capital": "Apia",
    "population": 219306,
    "flag": "/flags/ws.svg",
    "facts": [
      "En 2011 se pasó al otro lado de la línea de cambio de fecha para alinearse con Asia y Oceanía.",
      "El tatau, tatuaje tradicional samoano, dio origen a la palabra 'tatuaje'.",
      "El escritor Robert Louis Stevenson pasó aquí sus últimos años.",
      "La vida gira en torno al 'fa'a Samoa', el modo de vida tradicional.",
      "El samoano y el inglés son sus idiomas oficiales.",
      "Sus casas tradicionales, las fale, no tienen paredes para dejar pasar la brisa."
    ]
  },
  {
    "code": "kn",
    "name": "San Cristóbal y Nieves",
    "officialName": "Federación de San Cristóbal y Nieves",
    "continent": "América del Norte",
    "region": "Caribe",
    "capital": "Basseterre",
    "population": 46922,
    "flag": "/flags/kn.svg",
    "facts": [
      "Es el país más pequeño de América en superficie y población.",
      "Está formado por dos islas volcánicas.",
      "La fortaleza de Brimstone Hill es Patrimonio de la Humanidad.",
      "Un tren turístico recorre antiguas vías de la caña de azúcar.",
      "El inglés es su idioma oficial.",
      "Sus dos islas están separadas por un estrecho llamado 'The Narrows'."
    ]
  },
  {
    "code": "sm",
    "name": "San Marino",
    "officialName": "República de San Marino",
    "continent": "Europa",
    "region": "Europa Meridional",
    "capital": "Ciudad de San Marino",
    "population": 34109,
    "flag": "/flags/sm.svg",
    "facts": [
      "Se considera la república más antigua del mundo aún existente, fundada en el año 301.",
      "Está rodeada por completo por Italia.",
      "Se asienta sobre el monte Titano, con vistas panorámicas.",
      "Tiene dos jefes de Estado que gobiernan a la vez durante seis meses.",
      "Sus tres torres sobre el monte Titano aparecen en su bandera y escudo.",
      "Vende sellos y monedas de coleccionista muy buscados."
    ]
  },
  {
    "code": "vc",
    "name": "San Vicente y las Granadinas",
    "officialName": "San Vicente y las Granadinas",
    "continent": "América del Norte",
    "region": "Caribe",
    "capital": "Kingstown",
    "population": 99924,
    "flag": "/flags/vc.svg",
    "facts": [
      "Sus islas Granadinas son un paraíso para la navegación a vela.",
      "El volcán La Soufrière entró en erupción por última vez en 2021.",
      "Parte de 'Piratas del Caribe' se rodó en sus aguas.",
      "El árbol del pan llegó aquí en la histórica travesía del capitán Bligh.",
      "El inglés es su idioma oficial.",
      "Sus islas menores son diminutos refugios de arena y mar turquesa."
    ]
  },
  {
    "code": "lc",
    "name": "Santa Lucía",
    "officialName": "Santa Lucía",
    "continent": "América del Norte",
    "region": "Caribe",
    "capital": "Castries",
    "population": 180149,
    "flag": "/flags/lc.svg",
    "facts": [
      "Los Pitons, dos picos volcánicos gemelos, son su símbolo más famoso.",
      "Se dice que es el único país que lleva el nombre de una mujer.",
      "Tiene uno de los pocos volcanes al que se accede en coche.",
      "Ha dado dos premios Nobel, una cifra altísima para su tamaño.",
      "Sus manantiales de azufre brotan junto a fuentes de aguas termales.",
      "El inglés es oficial, pero también se habla un criollo de base francesa."
    ]
  },
  {
    "code": "st",
    "name": "Santo Tomé y Príncipe",
    "officialName": "República Democrática de Santo Tomé y Príncipe",
    "continent": "África",
    "region": "África Central",
    "capital": "Santo Tomé",
    "population": 240254,
    "flag": "/flags/st.svg",
    "facts": [
      "Es el segundo país más pequeño de África por población.",
      "Fue uno de los mayores productores mundiales de cacao a inicios del siglo XX.",
      "Está formado por dos islas volcánicas en el golfo de Guinea.",
      "El ecuador pasa por un islote justo al sur de sus costas.",
      "El portugués es su idioma oficial.",
      "Su cacao vuelve a estar entre los más valorados del mundo."
    ]
  },
  {
    "code": "sn",
    "name": "Senegal",
    "officialName": "República de Senegal",
    "continent": "África",
    "region": "África Occidental",
    "capital": "Dakar",
    "population": 18931966,
    "flag": "/flags/sn.svg",
    "facts": [
      "El lago Rosa debe su color a un alga que tiñe el agua.",
      "El histórico Rally Dakar terminaba junto a su capital.",
      "La isla de Gorea es un lugar de memoria del comercio de esclavos.",
      "El francés es su lengua oficial y el wolof, la más hablada.",
      "El thieboudienne, arroz con pescado, es su plato nacional.",
      "La lucha senegalesa es un deporte tradicional que llena estadios."
    ]
  },
  {
    "code": "rs",
    "name": "Serbia",
    "officialName": "República de Serbia",
    "continent": "Europa",
    "region": "Europa Sudoriental",
    "capital": "Belgrado",
    "population": 6549143,
    "flag": "/flags/rs.svg",
    "facts": [
      "Belgrado es una de las ciudades habitadas más antiguas de Europa.",
      "El científico Nikola Tesla, de origen serbio, da nombre a una unidad de medida.",
      "El festival de música EXIT se celebra en una antigua fortaleza.",
      "La rakia, aguardiente de fruta, es su bebida tradicional por excelencia.",
      "Es uno de los mayores productores mundiales de frambuesas.",
      "Novak Djokovic, uno de los mejores tenistas de la historia, es serbio."
    ]
  },
  {
    "code": "sc",
    "name": "Seychelles",
    "officialName": "República de Seychelles",
    "continent": "África",
    "region": "África Oriental",
    "capital": "Victoria",
    "population": 122730,
    "flag": "/flags/sc.svg",
    "facts": [
      "Es el país africano menos poblado.",
      "El coco de mar, la semilla más grande del mundo, crece en sus islas.",
      "Su capital, Victoria, es una de las más pequeñas del mundo.",
      "Sus playas de granito rosado están entre las más fotografiadas del mundo.",
      "La tortuga gigante de Aldabra vive aquí en libertad.",
      "Tiene tres idiomas oficiales: criollo, inglés y francés."
    ]
  },
  {
    "code": "sl",
    "name": "Sierra Leona",
    "officialName": "República de Sierra Leona",
    "continent": "África",
    "region": "África Occidental",
    "capital": "Freetown",
    "population": 8819794,
    "flag": "/flags/sl.svg",
    "facts": [
      "Su nombre significa 'montañas del león' en portugués.",
      "Freetown fue fundada como hogar para esclavos liberados.",
      "De sus minas salió uno de los mayores diamantes jamás hallados.",
      "El inglés es su idioma oficial, con el krio como lengua franca.",
      "El 'árbol del algodón' de Freetown es un símbolo histórico de la ciudad.",
      "Sus playas de arena blanca se abren al Atlántico junto a la capital."
    ]
  },
  {
    "code": "sg",
    "name": "Singapur",
    "officialName": "República de Singapur",
    "continent": "Asia",
    "region": "Sudeste Asiático",
    "capital": "Singapur",
    "population": 6111175,
    "flag": "/flags/sg.svg",
    "facts": [
      "Es una ciudad-estado y uno de los países más pequeños del mundo.",
      "Tiene cuatro idiomas oficiales: malayo, mandarín, tamil e inglés.",
      "Los árboles artificiales de Gardens by the Bay son un icono moderno.",
      "Está prohibido vender chicle, entre otras estrictas normas de limpieza.",
      "Es una de las ciudades más verdes del mundo, con jardines verticales por doquier.",
      "Su aeropuerto de Changi tiene la mayor cascada interior del mundo."
    ]
  },
  {
    "code": "sy",
    "name": "Siria",
    "officialName": "República Árabe Siria",
    "continent": "Asia",
    "region": "Asia Occidental",
    "capital": "Damasco",
    "population": 25620427,
    "flag": "/flags/sy.svg",
    "facts": [
      "Damasco es una de las capitales habitadas más antiguas del mundo.",
      "Palmira conserva impresionantes ruinas de una ciudad caravanera.",
      "El jabón de Alepo es uno de los más antiguos del mundo.",
      "El árabe es su idioma oficial.",
      "Alepo fue durante siglos un gran cruce comercial de la Ruta de la Seda.",
      "Ugarit, en su costa, guarda uno de los primeros alfabetos del mundo."
    ]
  },
  {
    "code": "so",
    "name": "Somalia",
    "officialName": "República Federal de Somalia",
    "continent": "África",
    "region": "África Oriental",
    "capital": "Mogadiscio",
    "population": 19654739,
    "flag": "/flags/so.svg",
    "facts": [
      "Tiene la costa más larga de África continental, sobre el océano Índico.",
      "La estrella blanca de su bandera representa a los pueblos somalíes de la región.",
      "Es un país de tradición nómada con uno de los mayores censos de camellos.",
      "El somalí es su idioma, con una rica tradición de poesía oral.",
      "Se asocia con la legendaria 'tierra de Punt' de los antiguos egipcios.",
      "El incienso y la mirra se recolectan en sus tierras desde la Antigüedad."
    ]
  },
  {
    "code": "lk",
    "name": "Sri Lanka",
    "officialName": "República Socialista Democrática de Sri Lanka",
    "continent": "Asia",
    "region": "Asia Meridional",
    "capital": "Colombo",
    "population": 21756000,
    "flag": "/flags/lk.svg",
    "facts": [
      "Es uno de los mayores productores de té del mundo, el famoso té de Ceilán.",
      "La canela procede originalmente de esta isla.",
      "El león de su bandera representa al pueblo cingalés.",
      "Sus 'pescadores sobre zancos' se sientan en palos clavados en el mar.",
      "El diente sagrado de Buda se venera en un templo de Kandy.",
      "Antes se llamaba Ceilán, nombre que aún da fama a su té."
    ]
  },
  {
    "code": "za",
    "name": "Sudáfrica",
    "officialName": "República de Sudáfrica",
    "continent": "África",
    "region": "África Austral",
    "capital": "Pretoria",
    "population": 64747319,
    "flag": "/flags/za.svg",
    "facts": [
      "Tiene tres capitales: Pretoria, Bloemfontein y Ciudad del Cabo.",
      "Reconoce doce idiomas oficiales, entre ellos la lengua de signos.",
      "El cabo de Buena Esperanza fue clave en las rutas marítimas hacia Asia.",
      "Nelson Mandela fue su primer presidente elegido por todos, tras el apartheid.",
      "Fue sede del primer Mundial de fútbol en suelo africano, en 2010.",
      "La Montaña de la Mesa preside Ciudad del Cabo con su cima plana."
    ]
  },
  {
    "code": "sd",
    "name": "Sudán",
    "officialName": "República del Sudán",
    "continent": "África",
    "region": "África del Norte",
    "capital": "Jartum",
    "population": 51662147,
    "flag": "/flags/sd.svg",
    "facts": [
      "Tiene más pirámides que Egipto: las de Meroe, de la civilización kushita.",
      "En Jartum se unen el Nilo Blanco y el Nilo Azul.",
      "El desierto de Nubia cubre buena parte de su norte.",
      "El reino de Kush llegó a gobernar el propio Egipto como 'faraones negros'.",
      "El árabe es su idioma oficial junto al inglés.",
      "El Nilo recorre el país de sur a norte camino de Egipto."
    ]
  },
  {
    "code": "ss",
    "name": "Sudán del Sur",
    "officialName": "República de Sudán del Sur",
    "continent": "África",
    "region": "África Central",
    "capital": "Yuba",
    "population": 12188788,
    "flag": "/flags/ss.svg",
    "facts": [
      "Es el país más joven del mundo: se independizó de Sudán en 2011.",
      "El Sudd, un enorme humedal del Nilo, es de los mayores del mundo.",
      "Acoge una de las mayores migraciones de mamíferos terrestres del planeta.",
      "El inglés es su idioma oficial.",
      "El pueblo dinka mide su riqueza en cabezas de ganado.",
      "El Nilo Blanco atraviesa el país y forma su gran pantano, el Sudd."
    ]
  },
  {
    "code": "se",
    "name": "Suecia",
    "officialName": "Reino de Suecia",
    "continent": "Europa",
    "region": "Europa del Norte",
    "capital": "Estocolmo",
    "population": 10596620,
    "flag": "/flags/se.svg",
    "facts": [
      "Los premios Nobel se entregan cada año en Estocolmo.",
      "Su capital se extiende sobre 14 islas conectadas por puentes.",
      "Es la cuna de marcas y grupos conocidos en todo el mundo.",
      "El derecho de acceso libre permite pasear y acampar casi en cualquier naturaleza.",
      "La albóndiga sueca y los muebles planos de montar son íconos de su cultura.",
      "Recicla tanto que ha llegado a importar basura para generar energía."
    ]
  },
  {
    "code": "ch",
    "name": "Suiza",
    "officialName": "Confederación Suiza",
    "continent": "Europa",
    "region": "Europa Occidental",
    "capital": "Berna",
    "population": 9092436,
    "flag": "/flags/ch.svg",
    "facts": [
      "Es famosa por su neutralidad y no se unió a la ONU hasta 2002.",
      "Tiene cuatro idiomas oficiales: alemán, francés, italiano y romanche.",
      "El chocolate y los relojes suizos son conocidos en todo el mundo.",
      "El Cervino, de silueta piramidal, es uno de los picos más famosos del mundo.",
      "La cruz blanca de su bandera inspiró el emblema de la Cruz Roja.",
      "El túnel de base de San Gotardo es uno de los más largos del mundo."
    ]
  },
  {
    "code": "sr",
    "name": "Surinam",
    "officialName": "República de Surinam",
    "continent": "América del Sur",
    "region": "América del Sur",
    "capital": "Paramaribo",
    "population": 639850,
    "flag": "/flags/sr.svg",
    "facts": [
      "Es el país independiente más pequeño de Sudamérica.",
      "Gran parte de su territorio es selva tropical casi virgen.",
      "El neerlandés es su idioma oficial, herencia colonial.",
      "Es uno de los países con mayor cobertura forestal del mundo.",
      "Su población mezcla raíces indias, africanas, javanesas, chinas y europeas.",
      "Templos hindúes, mezquitas e iglesias conviven en su capital."
    ]
  },
  {
    "code": "th",
    "name": "Tailandia",
    "officialName": "Reino de Tailandia",
    "continent": "Asia",
    "region": "Sudeste Asiático",
    "capital": "Bangkok",
    "population": 71619863,
    "flag": "/flags/th.svg",
    "facts": [
      "Es el único país del Sudeste Asiático que nunca fue colonizado.",
      "El nombre ceremonial de Bangkok es uno de los topónimos más largos del mundo.",
      "Sus templos budistas y su cocina picante son mundialmente famosos.",
      "Se la conoce como 'la tierra de las sonrisas'.",
      "El muay thai, boxeo con codos y rodillas, es su deporte nacional.",
      "El festival Songkran celebra el Año Nuevo con batallas de agua."
    ]
  },
  {
    "code": "tz",
    "name": "Tanzania",
    "officialName": "República Unida de Tanzania",
    "continent": "África",
    "region": "África Oriental",
    "capital": "Dodoma",
    "population": 70545865,
    "flag": "/flags/tz.svg",
    "facts": [
      "El Kilimanjaro, la montaña más alta de África, se alza a 5.895 m.",
      "El archipiélago de Zanzíbar fue un histórico centro del comercio de especias.",
      "Comparte el lago Victoria, el mayor lago tropical del mundo.",
      "El cráter del Ngorongoro es una enorme caldera repleta de fauna.",
      "En la garganta de Olduvai se hallaron restos de los primeros humanos.",
      "El suajili es su lengua nacional, hablada en gran parte de África Oriental."
    ]
  },
  {
    "code": "tj",
    "name": "Tayikistán",
    "officialName": "República de Tayikistán",
    "continent": "Asia",
    "region": "Asia Central",
    "capital": "Dusambé",
    "population": 10786734,
    "flag": "/flags/tj.svg",
    "facts": [
      "Más de la mitad del país se eleva por encima de los 3.000 m.",
      "Las montañas del Pamir son apodadas 'el techo del mundo'.",
      "El pico Ismoil Somoni supera los 7.400 m de altitud.",
      "La carretera del Pamir es una de las rutas de montaña más altas del mundo.",
      "El tayiko es una lengua muy cercana al persa.",
      "El glaciar Fedchenko es de los mayores fuera de las regiones polares."
    ]
  },
  {
    "code": "tl",
    "name": "Timor Oriental",
    "officialName": "República Democrática de Timor Oriental",
    "continent": "Asia",
    "region": "Sudeste Asiático",
    "capital": "Dili",
    "population": 1418517,
    "flag": "/flags/tl.svg",
    "facts": [
      "Fue el primer país nuevo del siglo XXI: se independizó en 2002.",
      "El portugués y el tetun son sus idiomas oficiales.",
      "Ocupa la mitad oriental de la isla de Timor.",
      "Sus aguas forman parte de un mar riquísimo en corales y vida marina.",
      "El café es su principal producto de exportación agrícola.",
      "Es uno de los dos países de mayoría católica del Sudeste Asiático."
    ]
  },
  {
    "code": "tg",
    "name": "Togo",
    "officialName": "República Togolesa",
    "continent": "África",
    "region": "África Occidental",
    "capital": "Lomé",
    "population": 8591626,
    "flag": "/flags/tg.svg",
    "facts": [
      "Es una estrecha franja de tierra que va de la costa al interior.",
      "La región de Koutammakou destaca por sus casas-torre de barro batammariba.",
      "El fosfato es uno de sus principales recursos de exportación.",
      "El francés es su lengua oficial.",
      "El lago Togo y sus pueblos lacustres animan su corta costa.",
      "El vudú tiene aquí una fuerte presencia, como en el vecino Benín."
    ]
  },
  {
    "code": "to",
    "name": "Tonga",
    "officialName": "Reino de Tonga",
    "continent": "Oceanía",
    "region": "Polinesia",
    "capital": "Nukualofa",
    "population": 103742,
    "flag": "/flags/to.svg",
    "facts": [
      "Es la única monarquía que queda en el Pacífico y nunca fue colonizada.",
      "Se la conoce como 'las islas de los amigos'.",
      "Es uno de los primeros lugares del mundo en ver el amanecer.",
      "El rugby es su gran pasión y su selección es respetada en el mundo.",
      "En sus aguas se puede nadar junto a ballenas jorobadas cada año.",
      "El tongano y el inglés son sus idiomas oficiales."
    ]
  },
  {
    "code": "tt",
    "name": "Trinidad y Tobago",
    "officialName": "República de Trinidad y Tobago",
    "continent": "América del Norte",
    "region": "Caribe",
    "capital": "Puerto España",
    "population": 1367764,
    "flag": "/flags/tt.svg",
    "facts": [
      "Es cuna del calipso, la soca y el steelpan, tambor hecho de bidones.",
      "Su carnaval es uno de los más famosos del mundo.",
      "El lago de asfalto de La Brea es el mayor depósito natural de su tipo.",
      "El steelpan, hecho de bidones de metal, es su instrumento nacional.",
      "El ibis escarlata, su ave nacional, tiñe de rojo los manglares al atardecer.",
      "Sus reservas de petróleo y gas la hacen una economía próspera del Caribe."
    ]
  },
  {
    "code": "tn",
    "name": "Túnez",
    "officialName": "República Tunecina",
    "continent": "África",
    "region": "África del Norte",
    "capital": "Túnez",
    "population": 12348573,
    "flag": "/flags/tn.svg",
    "facts": [
      "Cartago, junto a la capital, fue una gran potencia rival de Roma.",
      "Su Sáhara sirvió de escenario para películas de 'Star Wars'.",
      "Fue el punto de partida de la Primavera Árabe en 2011.",
      "El anfiteatro de El Jem es uno de los coliseos romanos mejor conservados.",
      "El árabe es su idioma oficial, con amplio uso del francés.",
      "La isla de Yerba inspira leyendas desde la Odisea de Homero."
    ]
  },
  {
    "code": "tm",
    "name": "Turkmenistán",
    "officialName": "Turkmenistán",
    "continent": "Asia",
    "region": "Asia Central",
    "capital": "Asjabad",
    "population": 7618847,
    "flag": "/flags/tm.svg",
    "facts": [
      "El cráter de Darvaza, 'la puerta del infierno', arde sin parar desde hace décadas.",
      "El desierto del Karakum cubre la mayor parte del país.",
      "Sus alfombras tejidas a mano son un símbolo nacional presente en su bandera.",
      "Asjabad ostenta el récord de más edificios revestidos de mármol blanco del mundo.",
      "El caballo ajal-teké, de pelaje dorado y brillante, es su orgullo nacional.",
      "El melón es un emblema nacional y tiene hasta un día festivo dedicado."
    ]
  },
  {
    "code": "tr",
    "name": "Turquía",
    "officialName": "República de Turquía",
    "continent": "Asia",
    "region": "Asia Occidental",
    "capital": "Ankara",
    "population": 85878556,
    "flag": "/flags/tr.svg",
    "facts": [
      "Estambul es la única gran ciudad que se extiende sobre dos continentes.",
      "Capadocia es famosa por sus paisajes y sus vuelos en globo.",
      "Aquí se halla Göbekli Tepe, uno de los templos más antiguos conocidos.",
      "Santa Sofía de Estambul fue iglesia, mezquita y museo a lo largo de los siglos.",
      "Las piscinas blancas de Pamukkale parecen terrazas de algodón.",
      "El café turco forma parte esencial de su hospitalidad."
    ]
  },
  {
    "code": "tv",
    "name": "Tuvalu",
    "officialName": "Tuvalu",
    "continent": "Oceanía",
    "region": "Polinesia",
    "capital": "Funafuti",
    "population": 9492,
    "flag": "/flags/tv.svg",
    "facts": [
      "Es uno de los países más pequeños y menos poblados del mundo.",
      "Obtiene ingresos del alquiler de su dominio de internet, '.tv'.",
      "Sus atolones están muy amenazados por la subida del nivel del mar.",
      "Es uno de los países menos visitados del mundo por turistas.",
      "Su pista de aterrizaje se llena de gente para jugar cuando no hay vuelos.",
      "Planea crear una versión digital del país ante la subida del mar."
    ]
  },
  {
    "code": "ua",
    "name": "Ucrania",
    "officialName": "Ucrania",
    "continent": "Europa",
    "region": "Europa Oriental",
    "capital": "Kiev",
    "population": 38980376,
    "flag": "/flags/ua.svg",
    "facts": [
      "Es el país más extenso situado por completo dentro de Europa.",
      "Sus fértiles tierras negras la hicieron 'el granero de Europa'.",
      "Los colores de su bandera evocan el cielo azul sobre campos de trigo.",
      "La pysanka, huevo de Pascua decorado con cera, es un arte tradicional.",
      "El borsch, sopa de remolacha, es Patrimonio Cultural que se cocina en las casas.",
      "La estación de Arsenalna, en Kiev, es de las más profundas del mundo."
    ]
  },
  {
    "code": "ug",
    "name": "Uganda",
    "officialName": "República de Uganda",
    "continent": "África",
    "region": "África Oriental",
    "capital": "Kampala",
    "population": 51384894,
    "flag": "/flags/ug.svg",
    "facts": [
      "Alberga cerca de la mitad de los gorilas de montaña que quedan en el mundo.",
      "En su territorio el Nilo Blanco inicia su largo recorrido.",
      "Churchill la describió como 'la perla de África' por su naturaleza.",
      "El lago Victoria, que comparte con sus vecinos, es el mayor de África.",
      "En Jinja, el Nilo ofrece uno de los mejores rápidos para el rafting.",
      "Es uno de los países con la población de menor edad media del mundo."
    ]
  },
  {
    "code": "uy",
    "name": "Uruguay",
    "officialName": "República Oriental del Uruguay",
    "continent": "América del Sur",
    "region": "América del Sur",
    "capital": "Montevideo",
    "population": 3384688,
    "flag": "/flags/uy.svg",
    "facts": [
      "Fue anfitrión y primer campeón del Mundial de fútbol, en 1930.",
      "Tiene una de las mayores proporciones de vacas por habitante del mundo.",
      "Su nombre oficial completo es República Oriental del Uruguay.",
      "El mate acompaña a su gente a todas partes, con el termo bajo el brazo.",
      "El asado es todo un ritual social de fin de semana.",
      "Fue pionero en dar una laptop a cada escolar con el Plan Ceibal."
    ]
  },
  {
    "code": "uz",
    "name": "Uzbekistán",
    "officialName": "República de Uzbekistán",
    "continent": "Asia",
    "region": "Asia Central",
    "capital": "Taskent",
    "population": 37053428,
    "flag": "/flags/uz.svg",
    "facts": [
      "Samarcanda y Bujará fueron ciudades clave de la Ruta de la Seda.",
      "Es uno de los dos únicos países del mundo rodeado solo por países sin mar.",
      "El plov, arroz con carne y zanahoria, es su plato nacional.",
      "La plaza Registán de Samarcanda deslumbra con sus madrazas de azulejos azules.",
      "Es uno de los mayores productores de algodón del mundo.",
      "El mar de Aral, que baña su norte, se ha secado casi por completo."
    ]
  },
  {
    "code": "vu",
    "name": "Vanuatu",
    "officialName": "República de Vanuatu",
    "continent": "Oceanía",
    "region": "Melanesia",
    "capital": "Port Vila",
    "population": 335169,
    "flag": "/flags/vu.svg",
    "facts": [
      "El salto en liana, precursor del puénting, nació en sus islas.",
      "El volcán Yasur es uno de los más accesibles y activos del mundo.",
      "Ha figurado entre los países que se declaran más felices del mundo.",
      "En una de sus islas se venera a un príncipe británico como figura sagrada.",
      "Tiene más de cien lenguas locales para una población pequeña.",
      "El bislama, un criollo, sirve de lengua común entre sus islas."
    ]
  },
  {
    "code": "ve",
    "name": "Venezuela",
    "officialName": "República Bolivariana de Venezuela",
    "continent": "América del Sur",
    "region": "América del Sur",
    "capital": "Caracas",
    "population": 28516896,
    "flag": "/flags/ve.svg",
    "facts": [
      "El Salto Ángel es la cascada más alta del mundo, con casi 1.000 m.",
      "Tiene algunas de las mayores reservas de petróleo del planeta.",
      "El relámpago del Catatumbo produce tormentas eléctricas casi permanentes.",
      "El Salto Ángel cae desde un tepuy, meseta de paredes verticales.",
      "Sus tepuyes inspiraron 'El mundo perdido' de Arthur Conan Doyle.",
      "El béisbol rivaliza con el fútbol como deporte más seguido."
    ]
  },
  {
    "code": "vn",
    "name": "Vietnam",
    "officialName": "República Socialista de Vietnam",
    "continent": "Asia",
    "region": "Sudeste Asiático",
    "capital": "Hanói",
    "population": 101598527,
    "flag": "/flags/vn.svg",
    "facts": [
      "La bahía de Ha Long, con miles de islotes calizos, es Patrimonio de la Humanidad.",
      "Es uno de los mayores exportadores de café del mundo.",
      "La estrella dorada de su bandera representa al pueblo y sus clases sociales.",
      "El pho, sopa de fideos y hierbas, es su plato más internacional.",
      "Las cuevas de Son Doong figuran entre las mayores del mundo.",
      "El sombrero cónico, el nón lá, protege del sol y de la lluvia."
    ]
  },
  {
    "code": "ye",
    "name": "Yemen",
    "officialName": "República de Yemen",
    "continent": "Asia",
    "region": "Asia Occidental",
    "capital": "Saná",
    "population": 41773878,
    "flag": "/flags/ye.svg",
    "facts": [
      "La ciudad vieja de Saná destaca por sus casas-torre de barro decoradas.",
      "La isla de Socotra alberga plantas que no existen en ningún otro lugar.",
      "El café moca toma su nombre del puerto yemení de Moca.",
      "El árbol de sangre de dragón, con forma de paraguas, crece solo en Socotra.",
      "El café llegó a Europa en gran parte por su puerto de Moca.",
      "Shibam es apodada 'el Manhattan del desierto' por sus torres de barro."
    ]
  },
  {
    "code": "dj",
    "name": "Yibuti",
    "officialName": "República de Yibuti",
    "continent": "África",
    "region": "África Oriental",
    "capital": "Yibuti",
    "population": 1184076,
    "flag": "/flags/dj.svg",
    "facts": [
      "El lago Assal, a 155 m bajo el nivel del mar, es el punto más bajo de África.",
      "Su posición junto al mar Rojo lo hace un enclave estratégico.",
      "El lago Abbé destaca por sus chimeneas de piedra caliza de aspecto lunar.",
      "El lago Assal está entre los cuerpos de agua más salados del planeta.",
      "El árabe y el francés son sus idiomas oficiales.",
      "Cada temporada, tiburones ballena se acercan a su golfo de Tayura."
    ]
  },
  {
    "code": "zm",
    "name": "Zambia",
    "officialName": "República de Zambia",
    "continent": "África",
    "region": "África Oriental",
    "capital": "Lusaka",
    "population": 21913874,
    "flag": "/flags/zm.svg",
    "facts": [
      "Comparte con Zimbabue las cataratas Victoria, entre las mayores del mundo.",
      "El águila de su bandera simboliza la libertad y la superación.",
      "Es uno de los mayores productores de cobre de África.",
      "En la 'Piscina del Diablo', junto a las cataratas Victoria, se baña al borde del abismo.",
      "El inglés es su idioma oficial, junto a decenas de lenguas locales.",
      "El río Zambeze recorre el país y marca su frontera sur."
    ]
  },
  {
    "code": "zw",
    "name": "Zimbabue",
    "officialName": "República de Zimbabue",
    "continent": "África",
    "region": "África Oriental",
    "capital": "Harare",
    "population": 16950795,
    "flag": "/flags/zw.svg",
    "facts": [
      "Las ruinas del Gran Zimbabue dieron nombre al país.",
      "El 'Pájaro de Zimbabue', de esas ruinas, aparece en su bandera.",
      "Comparte las cataratas Victoria, llamadas localmente 'el humo que truena'.",
      "El Gran Zimbabue fue una gran ciudad de piedra levantada sin mortero.",
      "El parque de Hwange es uno de los mayores refugios de elefantes de África.",
      "Llegó a emitir billetes de cien billones por su histórica hiperinflación."
    ]
  }
];

export default countries;
