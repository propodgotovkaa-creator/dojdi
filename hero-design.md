# Новые герои · версия 2

Рисунки: assets/images/heroes-v2.png. Созданы встроенным imagegen, затем доработаны им же: отделены рукава и очищена прозрачность. Исходный PNG сохранён без изменения альфа-канала. Части лица и корпуса используются вместе с непрерывно рисуемыми конечностями.

Походка основана на записи реального движения CMU 16_15. Источник и преобразования описаны в motion-source.md. Просмотр: walk-preview.html — пауза, замедление и выбор фазы.

## Запрос генерации

Use case: illustration-story. Production character asset sheet for a side-scrolling children's game. Transparent background. Exactly TWO rows and TWO columns, four separate isolated cutout objects, ample transparent gaps. Facing RIGHT strict 90 degree side profile. Top left: young adult woman's head and neck only, warm brown hair tied in low ponytail, kind small face, understated editorial animation illustration, natural adult proportions. Top right: her mustard yellow raincoat TORSO ONLY from shoulders to upper thigh, no head, no arms, no legs, tailored simple silhouette, side profile right, rounded hem, subtle pocket and buttons. Bottom left: young adult man's head and neck only, short dark brown hair, friendly profile right, natural adult proportions, no hat. Bottom right: his muted teal blue rain jacket TORSO ONLY shoulders to hip, no head arms legs, simple pocket zipper. Clean solid flat colours with restrained shadows, refined 2D animation character design, warm muted palette, no outlines or very subtle contours. These are disconnected skeletal animation puppet parts, not whole figures. Keep all objects entirely inside their quadrant, do not overlap. No labels, no text, no ground, no scenery, no props. Exact transparent alpha background.

## Правка встроенным imagegen

Keep the same four parts and positions. Remove glowing halos and shadows outside silhouettes. Truly transparent background. Make both coats sleeveless torso pieces with no arms drawn on them, keeping faces and clothing colours.

## Правка капюшона (встроенный imagegen)

Атлас heroes-hood-v2.png: мужская голова с прилегающим капюшоном, соответствующим куртке, при сохранении лица, размера и расположения. На мужском торсе убран опущенный капюшон. Женские части оставлены без изменений. Капюшон и исходная голова совмещены по координатам атласа.

## Отдельная ткань капюшона

Встроенный imagegen, исходник heroes-hood-v2.png, результат assets/images/hood-fabric.png. Голова остаётся отдельным неизменным рисунком. Рука сначала достигает края ткани, отводит его назад, затем опускается; капюшон остаётся сложенным за шеей.

Запрос: Edit this exact transparent 1536x1024 animation atlas. Change ONLY the bottom-left object: remove all of the man's face, skin, neck, hair and head from inside the blue hood, replacing those pixels with full transparency. Leave ONLY the blue hood fabric as a standalone hollow clothing cutout in precisely the same position, shape, size and texture. The opening formerly occupied by face/hair must be transparent, not filled with blue cloth or shadow. Keep hood rim, crown, back and neck fabric exactly as drawn. All other three objects stay completely unchanged. True transparent alpha outside silhouettes and inside the hood opening. No new objects, no repositioning.
