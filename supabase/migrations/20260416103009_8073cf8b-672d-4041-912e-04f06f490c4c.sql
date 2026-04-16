
-- Bocadillo Bacon y Queso (e4a5e9a7) - añadir remove bacon, queso
UPDATE products SET options = jsonb_build_array(
  jsonb_build_object('id','lomo','name','Con Lomo','price',0,'category','choice'),
  jsonb_build_object('id','pollo','name','Con Pollo','price',0,'category','choice'),
  jsonb_build_object('id','remove-bacon','name','Sin Bacon','price',0,'category','remove'),
  jsonb_build_object('id','remove-queso','name','Sin Queso','price',0,'category','remove')
) WHERE id = 'e4a5e9a7-99ca-418b-a916-d6bd0a13b6f9';

-- Bocadillo Queso, Lechuga y Tomate (74c18295)
UPDATE products SET options = jsonb_build_array(
  jsonb_build_object('id','lomo','name','Con Lomo','price',0,'category','choice'),
  jsonb_build_object('id','pollo','name','Con Pollo','price',0,'category','choice'),
  jsonb_build_object('id','remove-queso','name','Sin Queso','price',0,'category','remove'),
  jsonb_build_object('id','remove-lechuga','name','Sin Lechuga','price',0,'category','remove'),
  jsonb_build_object('id','remove-tomate','name','Sin Tomate','price',0,'category','remove')
) WHERE id = '74c18295-3355-4020-a524-4586072857ac';

-- Bocadillo Queso, Bacon y Tomate (203a7c30)
UPDATE products SET options = jsonb_build_array(
  jsonb_build_object('id','lomo','name','Con Lomo','price',0,'category','choice'),
  jsonb_build_object('id','pollo','name','Con Pollo','price',0,'category','choice'),
  jsonb_build_object('id','remove-queso','name','Sin Queso','price',0,'category','remove'),
  jsonb_build_object('id','remove-bacon','name','Sin Bacon','price',0,'category','remove'),
  jsonb_build_object('id','remove-tomate','name','Sin Tomate','price',0,'category','remove')
) WHERE id = '203a7c30-fb1b-4a48-8856-febbce0b23be';

-- Bocadillo Queso, Bacon y Pimiento Verde (a738ef98)
UPDATE products SET options = jsonb_build_array(
  jsonb_build_object('id','lomo','name','Con Lomo','price',0,'category','choice'),
  jsonb_build_object('id','pollo','name','Con Pollo','price',0,'category','choice'),
  jsonb_build_object('id','remove-queso','name','Sin Queso','price',0,'category','remove'),
  jsonb_build_object('id','remove-bacon','name','Sin Bacon','price',0,'category','remove'),
  jsonb_build_object('id','remove-pimiento','name','Sin Pimiento Verde','price',0,'category','remove')
) WHERE id = 'a738ef98-bc78-4068-95bc-a7b4cb5c80e0';

-- Bocadillo Rulo de Cabra y Cebolla Caramelizada (b00796e4)
UPDATE products SET options = jsonb_build_array(
  jsonb_build_object('id','lomo','name','Con Lomo','price',0,'category','choice'),
  jsonb_build_object('id','pollo','name','Con Pollo','price',0,'category','choice'),
  jsonb_build_object('id','remove-rulo','name','Sin Rulo de Cabra','price',0,'category','remove'),
  jsonb_build_object('id','remove-cebolla','name','Sin Cebolla Caramelizada','price',0,'category','remove')
) WHERE id = 'b00796e4-d6d0-4cc8-9030-591b7f9547a5';

-- Bocadillo Bacon, Queso, Jamón y Huevo (eeeb7950)
UPDATE products SET options = jsonb_build_array(
  jsonb_build_object('id','lomo','name','Con Lomo','price',0,'category','choice'),
  jsonb_build_object('id','pollo','name','Con Pollo','price',0,'category','choice'),
  jsonb_build_object('id','remove-bacon','name','Sin Bacon','price',0,'category','remove'),
  jsonb_build_object('id','remove-queso','name','Sin Queso','price',0,'category','remove'),
  jsonb_build_object('id','remove-jamon','name','Sin Jamón','price',0,'category','remove'),
  jsonb_build_object('id','remove-huevo','name','Sin Huevo','price',0,'category','remove')
) WHERE id = 'eeeb7950-a52c-4b98-91a7-60d97fb96374';

-- Bocadillo Bacon y Queso duplicado (d4eaa9c8)
UPDATE products SET options = jsonb_build_array(
  jsonb_build_object('id','lomo','name','Con Lomo','price',0,'category','choice'),
  jsonb_build_object('id','pollo','name','Con Pollo','price',0,'category','choice'),
  jsonb_build_object('id','remove-bacon','name','Sin Bacon','price',0,'category','remove'),
  jsonb_build_object('id','remove-queso','name','Sin Queso','price',0,'category','remove')
) WHERE id = 'd4eaa9c8-e2f7-40d7-93ea-ead314db1f28';

-- Bocadillo Vegetal (ab778cb7) - lechuga, tomate, huevo cocido, espárragos, atún
UPDATE products SET options = jsonb_build_array(
  jsonb_build_object('id','remove-lechuga','name','Sin Lechuga','price',0,'category','remove'),
  jsonb_build_object('id','remove-tomate','name','Sin Tomate','price',0,'category','remove'),
  jsonb_build_object('id','remove-huevo','name','Sin Huevo Cocido','price',0,'category','remove'),
  jsonb_build_object('id','remove-esparragos','name','Sin Espárragos','price',0,'category','remove'),
  jsonb_build_object('id','remove-atun','name','Sin Atún','price',0,'category','remove')
) WHERE id = 'ab778cb7-7a35-4c6d-80b5-cad6c9ae0ab8';

-- Bocadillo Pollo Empanado con Ali-Oli (db51521c)
UPDATE products SET options = jsonb_build_array(
  jsonb_build_object('id','remove-alioli','name','Sin Ali-Oli','price',0,'category','remove')
) WHERE id = 'db51521c-8ee1-443a-919c-45705d573564';
