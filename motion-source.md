# Источник движения

Ходьба основана на записи CMU Graphics Lab, motion 16_15 (walk), BVH conversion by Bruce Hahne.

- Библиотека: https://mocap.cs.cmu.edu/
- Исходная запись: https://github.com/una-dinosauria/cmu-mocap/blob/master/data/016/16_15.bvh
- Условия использования: https://github.com/una-dinosauria/cmu-mocap/blob/master/READMEFIRST.txt (Usage rights). Разрешено использование в исследовательских и коммерческих проектах.

Использован цикл кадров 61–198, продолжительность 1,1416621 с. Координаты суставов получены прямой кинематикой BVH и спроецированы сбоку. На стыке цикла устранено малое смещение. Пол сохранён на уровне нижней подошвы. Рука с зонтом и реакция после дождя анимируются отдельно; они не взяты из захвата движения. Художественный результат требует визуальной оценки, тесты проверяют только технические свойства.

The data used in this project was obtained from mocap.cs.cmu.edu. The database was created with funding from NSF EIA-0196217.
