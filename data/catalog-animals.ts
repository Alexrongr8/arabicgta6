/** GTA VI wildlife, compiled from Outputlag, GTA6 Info and GTABites (Nov 2026). */
export type AGroup = "reptile" | "sea" | "fish" | "bird" | "mammal" | "farm" | "pet" | "cryptid";
export interface Animal {
  en: string;
  ar: string;
  group: AGroup;
  whereAr?: string;
  whereEn?: string;
  hunt?: boolean;
  fish?: boolean;
  dangerAr?: string;
  dangerEn?: string;
  link?: string;
}

export const ANIMAL_SOURCES = [
  { title: "Outputlag — how to study wildlife, all 255 entries", url: "https://outputlag.com/guides/gta-6-animals-wildlife/" },
  { title: "GTA6 Info — animals", url: "https://gta6info.com/pages/animals.html" },
  { title: "GTABites — every species shown", url: "https://www.gtabites.com/animals" },
  { title: "GTABase — confirmed GTA 6 animals", url: "https://www.gtabase.com/gta-6/animals/" },
];

export const ANIMALS: Animal[] = [
  { en: "American Alligator", ar: "تمساح أمريكي", group: "reptile", whereAr: "مستنقعات Grassrivers بالجنوب الغربي", whereEn: "Grassrivers swamps (south-west)", hunt: true, dangerAr: "عضة وحدة تاخذ جزء كبير من صحتك", dangerEn: "One bite takes a big chunk of your health", link: "hunting-and-wildlife" },
  { en: "Albino American Alligator", ar: "تمساح ألبينو (نادر)", group: "reptile", whereAr: "الأراضي الرطبة، أحياناً قرب مكان صيد في Hamlet", whereEn: "Wetlands, sometimes near a Hamlet fishing spot", hunt: true, link: "hunting-and-wildlife" },
  { en: "Juvenile American Alligator", ar: "تمساح صغير", group: "reptile", whereAr: "حفرة التماسيح في حديقة الحيوان", whereEn: "Zoo alligator pit" },
  { en: "American Crocodile", ar: "كروكوديل أمريكي", group: "reptile", whereAr: "السواحل والمياه المالحة", whereEn: "Coasts and salt water", hunt: true, dangerAr: "خطير مثل التمساح", dangerEn: "As dangerous as the alligator" },
  { en: "Green Iguana", ar: "إغوانا خضرا", group: "reptile", whereAr: "في كل مكان: جذوع النخل، الشوارع، بيت Jason", whereEn: "Everywhere: palm trunks, roads, Jason's house" },
  { en: "Sea Turtle", ar: "سلحفاة بحرية", group: "reptile", whereAr: "شعاب الجزر", whereEn: "Keys reefs" },
  { en: "Snakes", ar: "ثعابين", group: "reptile", whereAr: "مخيمات مستنقعات Grassrivers", whereEn: "Grassrivers swamp camps" },
  { en: "Cane Toad", ar: "ضفدع القصب", group: "reptile" },
  { en: "Frog", ar: "ضفدع", group: "reptile" },
  { en: "Land Turtle", ar: "سلحفاة برية", group: "reptile" },
  { en: "Dolphins", ar: "دلافين", group: "sea", whereAr: "البحر المفتوح، تشوفها من القارب", whereEn: "Open sea, seen from boats" },
  { en: "Sharks (incl. hammerhead)", ar: "قروش (منها أبو مطرقة)", group: "sea", whereAr: "المياه العميقة وقنوات شعاب الجزر", whereEn: "Deep water and Keys reef channels", dangerAr: "القرش ممكن يقلب قاربك لو صدمه", dangerEn: "A shark ramming your boat can flip it" },
  { en: "Whales", ar: "حيتان", group: "sea" },
  { en: "Manta Rays", ar: "شفنين (مانتا)", group: "sea" },
  { en: "Crayfish", ar: "جراد البحر (كراي فش)", group: "sea" },
  { en: "Jellyfish", ar: "قناديل البحر", group: "sea" },
  { en: "Manatee", ar: "خروف البحر (مانيتي)", group: "sea" },
  { en: "Lionfish", ar: "سمكة الأسد", group: "fish", whereAr: "شعاب الجزر", whereEn: "Keys reefs" },
  { en: "Eel", ar: "ثعبان البحر", group: "fish", whereAr: "قاع شعاب الجزر", whereEn: "Keys reef floor" },
  { en: "Reef fish", ar: "أسماك الشعاب", group: "fish", whereAr: "كهوف شعاب الجزر", whereEn: "Keys reef caves", fish: true },
  { en: "Atlantic Spanish Mackerel", ar: "ماكريل إسباني", group: "fish", fish: true },
  { en: "Stoplight Parrotfish", ar: "سمكة الببغاء", group: "fish", fish: true },
  { en: "Flamingo", ar: "فلامنغو", group: "bird", whereAr: "مستنقعات Grassrivers وفوق مسابح فنادق Vice City", whereEn: "Grassrivers marshes, over Vice City hotel pools" },
  { en: "Great Egret", ar: "البلشون الأبيض", group: "bird", whereAr: "المياه الضحلة في الأراضي الرطبة", whereEn: "Shallow wetland water" },
  { en: "Great Blue Heron", ar: "مالك الحزين الأزرق", group: "bird", whereAr: "المياه الضحلة", whereEn: "Shallow water" },
  { en: "Roseate Spoonbill", ar: "أبو ملعقة الوردي", group: "bird", whereAr: "أراضي Grassrivers الرطبة", whereEn: "Grassrivers wetlands" },
  { en: "Caspian Tern", ar: "خرشنة قزوين", group: "bird", whereAr: "الأرصفة والممرات جنب الماء", whereEn: "Docks and decks by the water" },
  { en: "Black Vulture", ar: "نسر أسود", group: "bird" },
  { en: "Mottled Duck", ar: "بطة مرقّطة", group: "bird" },
  { en: "Seagull", ar: "نورس", group: "bird", whereAr: "السواحل والشواطئ", whereEn: "Coasts and beaches" },
  { en: "Pelican", ar: "بجع", group: "bird" },
  { en: "Pigeon", ar: "حمام", group: "bird", whereAr: "شوارع Vice City", whereEn: "Vice City streets" },
  { en: "Peacock", ar: "طاووس", group: "bird" },
  { en: "Whooping Crane", ar: "رهو أمريكي (كرين)", group: "bird", whereAr: "أراضي Grassrivers الرطبة", whereEn: "Grassrivers wetlands" },
  { en: "Woodpecker", ar: "نقار الخشب", group: "bird", whereAr: "الغابات", whereEn: "Forests" },
  { en: "Cougar / Florida Panther", ar: "كوجر / نمر فلوريدا", group: "mammal", whereAr: "جداول غابات Mount Kalaga", whereEn: "Mount Kalaga forest streams", hunt: true, dangerAr: "مفترس — خلك بعيد", dangerEn: "Predator — keep your distance" },
  { en: "White-tailed Deer", ar: "غزال أبيض الذيل", group: "mammal", whereAr: "تلال وجداول Mount Kalaga", whereEn: "Mount Kalaga hills and streams", hunt: true, link: "side-activities-list" },
  { en: "Northern Raccoon", ar: "راكون", group: "mammal", whereAr: "Mount Kalaga", whereEn: "Mount Kalaga", hunt: true },
  { en: "Eastern Cottontail Rabbit", ar: "أرنب", group: "mammal", hunt: true },
  { en: "Bobcat", ar: "قط بري (بوب كات)", group: "mammal", whereAr: "Grassrivers", whereEn: "Grassrivers", hunt: true },
  { en: "Wild Boar / Feral Hog", ar: "خنزير بري", group: "mammal", whereAr: "مخيمات مستنقعات Grassrivers والأرياف", whereEn: "Grassrivers swamp camps and countryside", hunt: true, dangerAr: "يهجم — انتبه", dangerEn: "Can charge you" },
  { en: "Black Bear", ar: "دب أسود", group: "mammal", whereAr: "غابات Mount Kalaga", whereEn: "Mount Kalaga forests", hunt: true, dangerAr: "خطير جداً من قريب", dangerEn: "Very dangerous up close" },
  { en: "Fox", ar: "ثعلب", group: "mammal" },
  { en: "Beaver", ar: "قندس", group: "mammal" },
  { en: "Otter", ar: "ثعلب الماء", group: "mammal" },
  { en: "Possum", ar: "أبوسوم", group: "mammal" },
  { en: "Skunk", ar: "ظربان (سكنك)", group: "mammal" },
  { en: "Rat", ar: "جرذ", group: "mammal", whereAr: "أزقة المدينة", whereEn: "City alleys" },
  { en: "Cow", ar: "بقرة", group: "farm", whereAr: "المزارع والأرياف (مثل حول Ambrosia)", whereEn: "Farms and countryside (e.g. around Ambrosia)" },
  { en: "Sheep", ar: "خروف", group: "farm", whereAr: "المزارع — شافها لاعبين داخل اللعبة، لسه مو موجودة في القوائم المنشورة", whereEn: "Farms — seen by players in-game, not yet in published lists" },
  { en: "Squirrel", ar: "سنجاب", group: "mammal", whereAr: "غابات Mount Kalaga", whereEn: "Mount Kalaga woods" },
  { en: "Armadillo", ar: "أرماديلو", group: "mammal" },
  { en: "Rhesus Macaque", ar: "قرد ريسوس", group: "mammal" },
  { en: "Bengal Cat", ar: "قط بنغالي", group: "pet", whereAr: "الأحياء والبيوت", whereEn: "Neighbourhoods and homes" },
  { en: "Labrador Retriever", ar: "لابرادور", group: "pet", whereAr: "الشواطئ والأحياء", whereEn: "Beaches and neighbourhoods" },
  { en: "American Foxhound", ar: "كلب صيد أمريكي", group: "pet", whereAr: "الأحياء", whereEn: "Neighbourhoods" },
  { en: "American Pit Bull Terrier", ar: "بيتبول", group: "pet", whereAr: "كلاب حراسة في Vice City", whereEn: "Guard dogs in Vice City", dangerAr: "أصحابها يطلقونها عليك", dangerEn: "Owners may set them on you" },
  { en: "Australian Shepherd", ar: "شيبرد أسترالي", group: "pet" },
  { en: "Chihuahua", ar: "شيواوا", group: "pet" },
  { en: "Doberman", ar: "دوبرمان", group: "pet", dangerAr: "كلب حراسة", dangerEn: "Guard dog" },
  { en: "Rottweiler", ar: "روت وايلر", group: "pet", dangerAr: "كلب حراسة", dangerEn: "Guard dog" },
  { en: "Police K-9 (German Shepherd)", ar: "كلب الشرطة (جيرمن شيبرد)", group: "pet", dangerAr: "يلحقك ويطيّحك", dangerEn: "Chases you down and pins you", link: "wanted-level-heat-system" },
  { en: "Skunk Ape", ar: "Skunk Ape (بيغ فوت ليونيدا)", group: "cryptid", whereAr: "حول بحيرة Cottonmouth", whereEn: "Around Cottonmouth Lake", link: "skunk-ape-mr-mangrove" },
];
