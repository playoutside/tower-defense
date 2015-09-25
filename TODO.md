
bis 3, ab 10 bis 13, 14 bis 19, Feierabend


~~Neues Level (RUBEN)~~

~~Türme bauen können (KEVIN) +Interaktion~~

~~Türme cooldowns / proximity Logik (MICHA)~~

~~Türme feuern (MICHA)~~

~~Creeps Schaden erleiden lassen (creep disposal) (RUBEN)~~

~~Feature: Türme upgraden - UI sollte dazu schon stehen - im Grunde analog zum bauen (MICHAEL)~~

~~Bug: Circle anzeigen, auch wenn Turm da ist (RUBEN)~~

~~Bug: Bereits vorhandene Spieler mit anzeigen (RUBEN)~~

~~Bug: Bereits platzierte Türme anzeigen wenn der Spieler sich später einloggt (RUBEN)~~

~~Feature: Credits verteilen und ausgeben STATUS (KEVIN)~~

Feature: bauen kostet Credits (MICHAEL)

~~Feature: Schüsse visualisieren (KEVIN)~~

~~Feature: Lebensbalken für Creeps (RUBEN)~~

Bug: Bauoptionen werden erst nach einem Bau erst wieder aktualisiert, wenn man sich bewegt hat (RUBEN)

Bug: Level Marker für Türme nur auf dem ersten Turm (KEVIN)

Bug: TypeError: Cannot read property 'id' of undefined

		lib\gameObjects\Creeps.js:123
			removeMsg.push({id: activeCreeps[item].id});


Bonus: Deployment auf externen Server / von Aussen erreichbar machen

---

creeps:
	lifepoints
	speed
	terrain? (air/ground?)
	attack?
	loot? stationary?

towers:
	hp?
	attack strength
		speed
		cooldown
		radius
		terrain?

path:
	predefined?
	random?
