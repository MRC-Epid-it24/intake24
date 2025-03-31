/**
 * Dictionary of common Japanese foods with their variations
 * This helps with matching food terms even when they're written in different ways
 */
export const commonJapaneseFoods = {
  // Noodle dishes
  ラーメン: ['らあめん', 'らーめん', '拉麺', 'ラァメン', 'ラメン'],
  うどん: ['饂飩', 'ウドン', 'うーどん'],
  そば: ['蕎麦', 'ソバ', '十割そば', '十割蕎麦'],
  焼きそば: ['やきそば', 'ヤキソバ', '焼そば', '焼きソバ'],
  冷やし中華: ['ひやしちゅうか', 'ヒヤシチュウカ', '冷し中華'],
  冷麺: ['れいめん', 'レイメン', '冷やし麺', '冷やしめん'],
  つけ麺: ['つけめん', 'ツケメン', 'ざるラーメン', 'ざるらーめん'],
  そうめん: ['素麺', 'ソウメン', '冷やしそうめん'],
  ひやむぎ: ['冷や麦', '冷麦', 'ヒヤムギ'],
  ちゃんぽん: ['チャンポン', '長崎ちゃんぽん'],
  パスタ: ['スパゲッティ', 'スパゲティ', '麺類'],
  ナポリタン: ['ナポリタンスパゲッティ', 'ナポリタンパスタ'],
  まぜそば: ['混ぜそば', 'マゼソバ', '油そば', '台湾まぜそば'],
  かけうどん: ['かけ饂飩', 'シンプルうどん', '温かいうどん'],
  ざるうどん: ['ざる饂飩', '冷たいうどん', '冷やしうどん'],
  きつねうどん: ['狐うどん', '油揚げうどん', 'お揚げうどん'],
  たぬきうどん: ['狸うどん', '天かすうどん'],
  鍋焼きうどん: ['なべやきうどん', '土鍋うどん', 'あつあつうどん'],
  もりそば: ['盛りそば', '冷たいそば', 'ざるそば'],
  かけそば: ['掛けそば', '温かいそば'],
  とろろそば: ['山かけそば', '山芋そば'],

  // Ramen variations
  とんこつラーメン: ['豚骨ラーメン', '博多とんこつ', '博多ラーメン'],
  醤油ラーメン: ['しょうゆラーメン', 'ショウユラーメン', '東京ラーメン'],
  味噌ラーメン: ['みそラーメン', 'ミソラーメン', '札幌ラーメン'],
  塩ラーメン: ['しおラーメン', 'シオラーメン', '函館ラーメン'],
  博多ラーメン: ['はかたラーメン', '博多とんこつラーメン', '九州ラーメン'],
  札幌ラーメン: ['さっぽろラーメン', '札幌味噌ラーメン', '北海道ラーメン'],

  // Rice dishes
  寿司: ['すし', 'スシ', '鮨', '鮓', '握り寿司', '巻き寿司'],
  炊き込みご飯: ['炊き込みごはん', '炊込みご飯', '炊き込み御飯'],
  チャーハン: ['炒飯', '炒めご飯', 'チャーハン', '焼き飯'],
  オムライス: ['おむらいす', 'オムレツライス', '卵ライス'],
  カレーライス: ['カレー', 'カリー', 'curry', 'カレーめし'],
  ビビンバ: ['ビビンパ', '韓国混ぜご飯', '石焼ビビンバ'],
  タコライス: ['タコス風ライス', 'タコスライス'],

  // Rice bowls (Donburi)
  丼物: ['どんぶり', 'ドンブリ', '丼ぶり'],
  親子丼: ['おやこどん', 'おやこ丼', 'オヤコドン', '鶏と卵の丼'],
  牛丼: ['ぎゅうどん', '牛どん', 'ビーフボウル', '牛めし'],
  天丼: ['てんどん', 'テンドン', '天どん', '海老天丼'],
  カツ丼: ['かつどん', 'カツドン', 'かつ丼', 'ポークカツレツ丼'],
  海鮮丼: ['かいせんどん', '海鮮どん', '海鮮丼ぶり', 'カイセンドン', '刺身丼'],
  うな丼: ['うなぎ丼', 'うな重', 'うなじゅう'],
  鰻丼: ['うなぎ丼', 'うな丼', 'うな重', 'うなじゅう'],

  // Fried/grilled dishes
  天ぷら: ['てんぷら', 'テンプラ', '天麩羅'],
  唐揚げ: ['からあげ', 'カラアゲ', '唐あげ', '唐アゲ', '鶏の唐揚げ'],
  とんかつ: ['豚カツ', 'トンカツ', '豚かつ', 'ポークカツレツ', '豚cutlet'],
  焼き鳥: ['やきとり', 'ヤキトリ', '焼鳥', '串焼き', '串焼'],
  お好み焼き: ['おこのみやき', 'おこのみ焼き', 'お好み焼', 'おこのみ焼', '広島風お好み焼き', '大阪風お好み焼き'],
  もんじゃ焼き: ['もんじゃやき', 'モンジャ焼き', 'もんじゃ焼', 'モンジャ焼', 'もんじゃ', 'モンジャ', '東京もんじゃ'],
  たこ焼き: ['たこやき', 'タコヤキ', 'たこ焼', 'タコ焼', '大阪たこ焼き', '明石焼き'],
  串カツ: ['くしかつ', 'クシカツ', '串かつ'],
  ステーキ: ['牛ステーキ', 'ビーフステーキ', '和牛ステーキ'],
  焼肉: ['やきにく', 'ヤキニク', '焼き肉', '韓国焼肉'],
  照り焼き: ['てりやき', 'テリヤキ', '照焼き', '照焼'],
  エビフライ: ['海老フライ', 'えびフライ', 'エビフリッター'],
  コロッケ: ['クロケット', 'ポテトコロッケ', '肉コロッケ'],
  ハンバーグ: ['hambagu', 'ハンバーグステーキ', '和風ハンバーグ'],

  // Simmered/stewed dishes
  煮物: ['にもの', '煮もの', '和風煮物'],
  おでん: ['オデン', '関東おでん', '関西おでん'],
  すき焼き: ['すきやき', 'スキヤキ', '牛すき焼き'],
  しゃぶしゃぶ: ['シャブシャブ', 'しゃぶ鍋'],
  肉じゃが: ['にくじゃが', 'ニクジャガ', '肉じゃがいも'],
  筑前煮: ['ちくぜんに', '筑前に', '九州煮物'],
  豚の角煮: ['豚角煮', 'ぶたのかくに', '豚バラ角煮'],

  // Soups and hot pots
  味噌汁: ['みそ汁', 'ミソ汁', 'みそしる'],
  豚汁: ['とん汁', 'トン汁', '豚汁みそ'],
  鍋料理: ['なべりょうり', '鍋もの', '冬の鍋'],
  キムチ鍋: ['キムチなべ', 'キムチ鍋料理'],
  水炊き: ['みずたき', '水たき', '博多水炊き'],
  湯豆腐: ['ゆどうふ', 'ユドウフ', '湯とうふ'],

  // Snacks and street food
  おにぎり: ['お握り', 'オニギリ', 'おむすび', 'お結び'],
  おむすび: ['お結び', 'オムスビ', 'おにぎり'],
  焼きおにぎり: ['やきおにぎり', '焼おにぎり', '焼きむすび'],
  餃子: ['ぎょうざ', 'ギョウザ', '饺子', '水餃子', '焼き餃子'],
  春巻き: ['はるまき', 'ハルマキ', '春巻'],
  肉まん: ['にくまん', 'ニクマン', '豚まん', '豚マン'],
  あんまん: ['あんパン', 'アンマン', '餡まん'],
  宇都宮餃子: ['うつのみやぎょうざ', '宇都宮ギョウザ', '栃木餃子'],
  明石焼き: ['あかしやき', 'アカシヤキ', '玉子焼き'],
  カツサンド: ['カツサンドイッチ', 'かつサンド', 'とんかつサンド'],
  たまごサンド: ['卵サンド', 'エッグサンド', '玉子サンドイッチ'],

  // Traditional Japanese sweets
  どら焼き: ['どらやき', 'どら焼', 'どらやき', 'どら菓子'],
  大福: ['だいふく', 'ダイフク', 'お餅', '餅菓子'],
  いちご大福: ['イチゴ大福', 'ストロベリー大福', '苺大福'],
  羊羹: ['ようかん', 'ヨウカン', '練羊羹', '水羊羹'],
  団子: ['だんご', 'ダンゴ', '串団子', 'みたらし団子'],
  みたらし団子: ['みたらしだんご', 'ミタラシダンゴ', 'みたらし'],
  あんこ: ['餡子', '餡', 'アンコ', 'あん'],
  わらび餅: ['わらびもち', 'ワラビモチ', '蕨餅'],
  もち: ['餅', 'モチ', '切り餅', '丸餅'],
  あんみつ: ['あんミツ', 'アンミツ', '餡蜜'],
  たい焼き: ['たいやき', 'タイヤキ', '鯛焼き'],
  今川焼き: ['いまがわやき', '今川焼', '回転焼き', '大判焼き'],
  ずんだ餅: ['ずんだもち', 'ズンダモチ', 'ずんだ大福'],
  カレーパン: ['カレーブレッド', 'カレーパンズ', 'カレーぱん'],

  // Special dishes
  茶碗蒸し: ['ちゃわんむし', 'チャワンムシ', '茶碗蒸'],
  納豆: ['なっとう', 'ナットウ', '糸引き納豆'],
  豆腐: ['とうふ', 'トウフ', '冷奴', '冷や奴'],
  お浸し: ['おひたし', 'オヒタシ', '浸し物'],
  刺身: ['さしみ', 'サシミ', '生魚', '鮮魚刺身'],
  明太子パスタ: ['めんたいこパスタ', 'メンタイコパスタ', '明太子スパゲッティ'],
  天むす: ['てんむす', 'テンムス', '天むすび', '名古屋めし'],
  ひつまぶし: ['ひつまぶし', 'ヒツマブシ', '名古屋うなぎ', '三段うなぎ'],

  // Sauces and condiments
  わさび: ['山葵', 'ワサビ', '本わさび', '粉わさび'],
  醤油: ['しょうゆ', 'ショウユ', '薄口醤油', '濃口醤油'],
  味噌: ['みそ', 'ミソ', '白味噌', '赤味噌'],
  ソース: ['とんかつソース', 'お好み焼きソース', 'ウスターソース'],
  マヨネーズ: ['マヨネーズ', 'キューピー', 'QP'],
  ポン酢: ['ぽんず', 'ポンズ', '柚子ポン酢'],
};
