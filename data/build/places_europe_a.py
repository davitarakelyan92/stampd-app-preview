# Places: es, pt, gr, tr, nl, be, ch, at, pl, cz, hu, hr, ie, se, no, dk, fi, de, uk, fr
# Tuple: id, name, city, chapter, lat, lng, precision, description, seasonal_label|None, source|None

P = []

def add(cid, rows):
    for r in rows:
        P.append((cid,) + r)

# --- Spain ---
add("es", [
("sagrada-familia","Sagrada Família","Barcelona","Monuments",41.4036,2.1744,"venue","Antoni Gaudí’s unfinished basilica rises with sculpted towers over Eixample. Inside, coloured light filters through tall stained-glass windows.","https://en.wikipedia.org/wiki/Sagrada_Fam%C3%ADlia"),
("alhambra","Alhambra","Granada","Monuments",37.1760,-3.5881,"venue","A Nasrid palace-fortress crowns a hill above Granada. Courtyards, carved stucco and reflecting pools reward a slow walk.","https://en.wikipedia.org/wiki/Alhambra"),
("prado","Museo del Prado","Madrid","Monuments",40.4138,-3.6921,"venue","Spain’s great art museum faces the Paseo del Prado. Rooms of Velázquez, Goya and more fill a neoclassical block.","https://en.wikipedia.org/wiki/Museo_del_Prado"),
("mezquita-cordoba","Mosque-Cathedral of Córdoba","Córdoba","Monuments",37.8789,-4.7794,"venue","A forest of striped arches fills the former Great Mosque, later a cathedral. The dual history is visible in one continuous floor.","https://en.wikipedia.org/wiki/Mosque%E2%80%93Cathedral_of_C%C3%B3rdoba"),
("park-guell","Park Güell","Barcelona","Monuments",41.4145,2.1527,"venue","Gaudí’s park spreads mosaic benches and stone colonnades over a Carmel hillside. City and sea views open from the terrace.","https://en.wikipedia.org/wiki/Park_G%C3%BCell"),
("retiro-park","El Retiro","Madrid","Visit",40.4153,-3.6845,"venue","Madrid’s central park holds a boating lake, formal gardens and the Crystal Palace. Locals walk, row and picnic between the avenues.","https://en.wikipedia.org/wiki/Parque_del_Buen_Retiro"),
("plaza-mayor-madrid","Plaza Mayor","Madrid","Visit",40.4155,-3.7074,"venue","An arcaded square anchors old Madrid with uniform façades and café terraces. Street life fills the centre from morning onward.","https://en.wikipedia.org/wiki/Plaza_Mayor,_Madrid"),
("ramblas","La Rambla","Barcelona","Visit",41.3810,2.1734,"venue","Barcelona’s famous tree-lined promenade runs from Plaça de Catalunya toward the waterfront. Flower stalls and side streets keep it busy.","https://en.wikipedia.org/wiki/La_Rambla"),
("guggenheim-bilbao","Guggenheim Museum Bilbao","Bilbao","Visit",43.2687,-2.9340,"venue","Frank Gehry’s titanium curves sit on the Nervión riverside. The building itself is as much a draw as the collection inside.","https://en.wikipedia.org/wiki/Guggenheim_Museum_Bilbao"),
("toledo-old-town","Toledo Old Town","Toledo","Visit",39.8586,-4.0244,"city","Winding lanes climb a hill ringed by the Tagus. Churches, synagogues and workshops share the compact historic core.","https://en.wikipedia.org/wiki/Toledo,_Spain"),
("boqueria","La Boqueria","Barcelona","Foods",41.3816,2.1719,"venue","Barcelona’s covered market opens off La Rambla with seafood, fruit and tapas counters. Arrive early for the fullest stalls.","https://en.wikipedia.org/wiki/La_Boqueria"),
("san-miguel-market","Mercado de San Miguel","Madrid","Foods",40.4155,-3.7089,"venue","A glass-and-iron food hall beside Plaza Mayor serves pintxos, oysters and wine by the glass. Stand at the counters and share plates.","https://en.wikipedia.org/wiki/Mercado_de_San_Miguel"),
("central-market-valencia","Central Market of Valencia","Valencia","Foods",39.4736,-0.3787,"venue","One of Europe’s largest fresh markets fills a modernist hall with produce and seafood. Try local oranges and rice ingredients for paella.","https://en.wikipedia.org/wiki/Mercat_Central_(Valencia)"),
("san-sebastian-old-town","Parte Vieja pintxos","San Sebastián","Foods",43.3240,-1.9860,"city","San Sebastián’s Old Town is lined with bars of Basque pintxos. Hop between counters for small bites and txakoli.","https://en.wikipedia.org/wiki/Old_Town_of_San_Sebasti%C3%A1n"),
("mercado-san-anton","Mercado de San Antón","Madrid","Foods",40.4221,-3.6976,"venue","A multi-level Chueca market mixes grocery stalls with ready-to-eat counters upstairs. Good for a casual lunch overlooking the square.","https://en.wikipedia.org/wiki/Mercado_de_San_Ant%C3%B3n"),
("feria-abril","Feria de Abril","Seville","Seasonal",37.3520,-5.9830,"approximate","Seville’s April Fair fills fairground casetas with flamenco dress, horse parades and late-night dancing after Holy Week.","Feria de Abril","https://en.wikipedia.org/wiki/Seville_Fair"),
])

# --- Portugal ---
add("pt", [
("jeronimos","Jerónimos Monastery","Lisbon","Monuments",38.6979,-9.2065,"venue","Manueline stonework wraps this riverside monastery in Belém. The cloister is a quiet counterpoint to the busy waterfront.","https://en.wikipedia.org/wiki/Jer%C3%B3nimos_Monastery"),
("belem-tower","Belém Tower","Lisbon","Monuments",38.6916,-9.2160,"venue","A fortified tower stands in the Tagus where ships once left for the Age of Discovery. Walk the bastion for river views.","https://en.wikipedia.org/wiki/Bel%C3%A9m_Tower"),
("pena-palace","Pena Palace","Sintra","Monuments",38.7876,-9.3906,"venue","A colourful Romantic palace crowns a Sintra hill above forest parks. Bright façades and terraces look toward the Atlantic.","https://en.wikipedia.org/wiki/Pena_Palace"),
("clérigos","Clérigos Church and Tower","Porto","Monuments",41.1457,-8.6140,"venue","Porto’s baroque Clérigos tower rises above the old city. Climb for a 360-degree view of roofs and the Douro.","https://en.wikipedia.org/wiki/Cl%C3%A9rigos_Church"),
("baixia-cathedral","Lisbon Cathedral","Lisbon","Monuments",38.7098,-9.1330,"venue","The Sé of Lisbon mixes Romanesque fortress walls with later chapels. It anchors the Alfama slope above the river.","https://en.wikipedia.org/wiki/Lisbon_Cathedral"),
("alfama","Alfama","Lisbon","Visit",38.7120,-9.1300,"city","Lisbon’s oldest district tumbles in alleys and miradouros above the Tagus. Fado houses and tiled façades fill the lanes.","https://en.wikipedia.org/wiki/Alfama"),
("livraria-lello","Livraria Lello","Porto","Visit",41.1467,-8.6147,"venue","A neo-Gothic bookshop famous for its crimson stair and stained glass. Timed entry helps manage the queues.","https://en.wikipedia.org/wiki/Livraria_Lello"),
("douro-ribeira","Ribeira district","Porto","Visit",41.1406,-8.6130,"city","Porto’s riverside quarter lines the Douro with colourful houses and cafés. Cross Dom Luís I bridge for the classic view.","https://en.wikipedia.org/wiki/Ribeira_(Porto)"),
("cabo-da-roca","Cabo da Roca","Sintra area","Visit",38.7804,-9.4987,"venue","A cliff-top cape marks mainland Europe’s westernmost point. Windswept paths look straight onto the Atlantic.","https://en.wikipedia.org/wiki/Cabo_da_Roca"),
("oceanario","Oceanário de Lisboa","Lisbon","Visit",38.7806,-9.0930,"venue","One of Europe’s large aquariums sits in Parque das Nações. Global ocean habitats share a vast central tank.","https://en.wikipedia.org/wiki/Ocean%C3%A1rio_de_Lisboa"),
("time-out-market","Time Out Market","Lisbon","Foods",38.7071,-9.1457,"venue","A food hall in Cais do Sodré gathers Portuguese chefs and stalls under one roof. Share small plates at communal tables.","https://en.wikipedia.org/wiki/Time_Out_Market_Lisboa"),
("mercado-bolhao","Mercado do Bolhão","Porto","Foods",41.1495,-8.6067,"venue","Porto’s historic market hall sells fresh produce, fish and flowers. The renovated building keeps the open-court feel.","https://en.wikipedia.org/wiki/Bolh%C3%A3o_Market"),
("pasteis-belem","Pastéis de Belém","Lisbon","Foods",38.6975,-9.2033,"venue","The bakery that popularised pastéis de nata still serves warm custard tarts beside the monastery. Expect a queue that moves quickly.","https://en.wikipedia.org/wiki/Past%C3%A9is_de_Bel%C3%A9m"),
("pinhao-wine","Pinhão wine terraces","Pinhão","Foods",41.1910,-7.5450,"city","Douro Valley terraces around Pinhão grow grapes for port and table wine. Quinta tastings pair river views with local bottles.","https://en.wikipedia.org/wiki/Pinh%C3%A3o"),
("mercado-da-ribeira-fresh","Mercado da Ribeira stalls","Lisbon","Foods",38.7070,-9.1455,"venue","Beside the Time Out hall, traditional stalls still sell fish and produce. It’s a working market as much as a visitor stop.","https://en.wikipedia.org/wiki/Time_Out_Market_Lisboa"),
("festas-santo-antonio","Festas de Santo António","Lisbon","Seasonal",38.7130,-9.1320,"approximate","Lisbon’s June saint festivals fill Alfama with grilled sardines, marches and street parties for Santo António.","Festas de Santo António","https://en.wikipedia.org/wiki/Santos_Populares"),
])

print("europe_a so far", len(P))
# write partial export
import json
open('/tmp/eu_a_count.txt','w').write(str(len(P)))
