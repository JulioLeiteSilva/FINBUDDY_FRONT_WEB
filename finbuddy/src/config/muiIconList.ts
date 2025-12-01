// src/config/muiIconList.ts
import React from 'react';
import { AddCircleOutline, SvgIconComponent } from '@mui/icons-material';

// Importe uma vasta gama de ícones do Material-UI
import {
    // Geral & UI
    Home, AccountCircle, Settings, Search, Menu, Close, Check, Add, Remove, Edit, Delete,
    Info, Warning, Error, HelpOutline, Visibility, VisibilityOff, Refresh, MoreVert, MoreHoriz,
    Done, Clear, ArrowBack, ArrowForward, ArrowDropDown, ArrowDropUp, Star, StarBorder, Favorite, FavoriteBorder,
    Notifications, Email, Phone, Person, Group, Lock, LockOpen, Fingerprint, LightMode, DarkMode,
    CloudUpload, CloudDownload, Folder, InsertDriveFile, AttachFile, Link,
    FilterList, Sort, ContentCopy, ContentCut, ContentPaste, Print, Share, Save,
    CalendarToday, Schedule, AccessTime, Alarm, Timer,
    Place, Map, Navigation, MyLocation, Layers,
    Dashboard, BarChart, PieChart, Timeline, ShowChart, Assessment,
    Code, Terminal, Storage, Dns, Memory, Speed,
    BugReport, Construction, Build, SupportAgent, Rule, Gavel,
    ThumbUp, ThumbDown, Comment, Chat, Forum, QuestionAnswer,
    PowerSettingsNew, ExitToApp, Login, Logout, VpnKey, Security,
    Report, Flag, Shield, VerifiedUser, PrivacyTip,
    Devices, // <--- ADICIONADO (Para Eletrônicos)

    // Finanças & Comércio
    AccountBalance, AccountBalanceWallet, CreditCard, ShoppingCart, Store, Receipt,
    AttachMoney, MonetizationOn, EuroSymbol, Paid, Savings, Payment, PriceCheck,
    TrendingUp, TrendingDown, PointOfSale, ShoppingBag, Redeem, CardGiftcard, LocalOffer,
    RequestQuote, QueryStats, DonutSmall, Leaderboard,
    MoneyOff,        // <--- ADICIONADO (Para Liability/Despesa)
    CurrencyBitcoin, // <--- ADICIONADO (Para Criptomoedas)

    // Transporte & Viagem
    Train, DirectionsCar, LocalShipping, Flight, Hotel, LocalGasStation, Restaurant, LocalBar,
    LocalCafe, Fastfood, LocalDining, LocalPizza, TwoWheeler, PedalBike, Subway, Tram,
    Luggage, ConnectingAirports, Sailing, Anchor,

    // Casa & Vida
    Apartment, SingleBed, Bed, KingBed, Chair, TableRestaurant, Blender, CoffeeMaker, Microwave,
    Countertops, Deck, Fence, Fireplace, Flatware, Hardware, Lightbulb, Outlet, Shower,
    Weekend, Umbrella, BeachAccess, Pool, FitnessCenter, Spa, ChildFriendly, Pets,
    House, Cottage, Villa, LocationCity, Business,
    Domain, // <--- ADICIONADO (Para REITs/Prédios comerciais)

    // Saúde & Bem-Estar
    LocalHospital, MedicalServices, Healing, Medication, Bloodtype, Vaccines, MonitorHeart,
    SelfImprovement, Psychology, AccessibilityNew, Elderly, PregnantWoman, Stroller,

    // Educação & Trabalho
    School, Work, BusinessCenter, Book, LibraryBooks, Class, Campaign, RecordVoiceOver,
    Calculate, Functions, Architecture, DesignServices, Engineering, Science, Biotech,

    // Natureza & Comida
    Forest, Grass, Park, Public, Agriculture, Yard, NaturePeople, EnergySavingsLeaf,
    WaterDrop, Air, WbSunny, NightsStay, FilterVintage, Terrain, Landscape,
    Apple, BakeryDining, BrunchDining, Cake, Cookie, Egg, Icecream, Liquor, LunchDining,
    Nightlife, RamenDining, RiceBowl, SetMeal, TakeoutDining, Tapas, WineBar,

    // Mídia & Comunicação
    PhotoCamera, Image, MusicNote, Movie, Videocam, VolumeUp, VolumeDown, Mic, Call,
    Speaker, Radio, Album, LibraryMusic, Subscriptions, SmartDisplay, Web, Language,
    Translate, RssFeed, Wifi, Bluetooth, SignalCellularAlt, NetworkCheck,

    // Outros & Específicos
    Category, Label, Palette, AutoAwesome, Style, Extension, Toys, SmartToy, SportsEsports,
    Casino, SportsSoccer, SportsBasketball, SportsTennis, EmojiEvents, EmojiObjects, EmojiPeople,
    EmojiNature, EmojiFoodBeverage, EmojiTransportation, EmojiFlags, EmojiSymbols,
    Diamond, // <--- ADICIONADO (Para Joias)
} from '@mui/icons-material';

/**
 * Mapa que associa o nome do ícone (string) ao componente do ícone MUI.
 * Este mapa é usado pelo utilitário GetMuiIcon para renderização dinâmica.
 */
export const iconComponentsMap: Record<string, SvgIconComponent> = {
    // Geral & UI
    HomeIcon: Home, AccountCircleIcon: AccountCircle, SettingsIcon: Settings, SearchIcon: Search, MenuIcon: Menu, CloseIcon: Close, CheckIcon: Check, AddIcon: Add, RemoveIcon: Remove, EditIcon: Edit, DeleteIcon: Delete,
    InfoIcon: Info, WarningIcon: Warning, ErrorIcon: Error, HelpOutlineIcon: HelpOutline, VisibilityIcon: Visibility, VisibilityOffIcon: VisibilityOff, RefreshIcon: Refresh, MoreVertIcon: MoreVert, MoreHorizIcon: MoreHoriz,
    DoneIcon: Done, ClearIcon: Clear, ArrowBackIcon: ArrowBack, ArrowForwardIcon: ArrowForward, ArrowDropDownIcon: ArrowDropDown, ArrowDropUpIcon: ArrowDropUp, StarIcon: Star, StarBorderIcon: StarBorder, FavoriteIcon: Favorite, FavoriteBorderIcon: FavoriteBorder,
    NotificationsIcon: Notifications, EmailIcon: Email, PhoneIcon: Phone, PersonIcon: Person, GroupIcon: Group, LockIcon: Lock, LockOpenIcon: LockOpen, FingerprintIcon: Fingerprint, LightModeIcon: LightMode, DarkModeIcon: DarkMode,
    CloudUploadIcon: CloudUpload, CloudDownloadIcon: CloudDownload, FolderIcon: Folder, InsertDriveFileIcon: InsertDriveFile, AttachFileIcon: AttachFile, LinkIcon: Link,
    FilterListIcon: FilterList, SortIcon: Sort, ContentCopyIcon: ContentCopy, ContentCutIcon: ContentCut, ContentPasteIcon: ContentPaste, PrintIcon: Print, ShareIcon: Share, SaveIcon: Save,
    CalendarTodayIcon: CalendarToday, ScheduleIcon: Schedule, AccessTimeIcon: AccessTime, AlarmIcon: Alarm, TimerIcon: Timer,
    PlaceIcon: Place, MapIcon: Map, NavigationIcon: Navigation, MyLocationIcon: MyLocation, LayersIcon: Layers,
    DashboardIcon: Dashboard, BarChartIcon: BarChart, PieChartIcon: PieChart, TimelineIcon: Timeline, ShowChartIcon: ShowChart, AssessmentIcon: Assessment,
    CodeIcon: Code, TerminalIcon: Terminal, StorageIcon: Storage, DnsIcon: Dns, MemoryIcon: Memory, SpeedIcon: Speed,
    BugReportIcon: BugReport, ConstructionIcon: Construction, BuildIcon: Build, SupportAgentIcon: SupportAgent, RuleIcon: Rule, GavelIcon: Gavel,
    ThumbUpIcon: ThumbUp, ThumbDownIcon: ThumbDown, CommentIcon: Comment, ChatIcon: Chat, ForumIcon: Forum, QuestionAnswerIcon: QuestionAnswer,
    PowerSettingsNewIcon: PowerSettingsNew, ExitToAppIcon: ExitToApp, LoginIcon: Login, LogoutIcon: Logout, VpnKeyIcon: VpnKey, SecurityIcon: Security,
    ReportIcon: Report, FlagIcon: Flag, ShieldIcon: Shield, VerifiedUserIcon: VerifiedUser, PrivacyTipIcon: PrivacyTip,
    DevicesIcon: Devices, // <--- ADICIONADO

    // Finanças & Comércio
    AccountBalanceIcon: AccountBalance, AccountBalanceWalletIcon: AccountBalanceWallet, CreditCardIcon: CreditCard, ShoppingCartIcon: ShoppingCart, StoreIcon: Store, ReceiptIcon: Receipt,
    AttachMoneyIcon: AttachMoney, MonetizationOnIcon: MonetizationOn, EuroSymbolIcon: EuroSymbol, PaidIcon: Paid, SavingsIcon: Savings, PaymentIcon: Payment, PriceCheckIcon: PriceCheck,
    TrendingUpIcon: TrendingUp, TrendingDownIcon: TrendingDown, PointOfSaleIcon: PointOfSale, ShoppingBagIcon: ShoppingBag, RedeemIcon: Redeem, CardGiftcardIcon: CardGiftcard, LocalOfferIcon: LocalOffer,
    RequestQuoteIcon: RequestQuote, QueryStatsIcon: QueryStats, DonutSmallIcon: DonutSmall, LeaderboardIcon: Leaderboard,
    MoneyOffIcon: MoneyOff,        // <--- ADICIONADO
    CurrencyBitcoinIcon: CurrencyBitcoin, // <--- ADICIONADO

    // Transporte & Viagem
    TrainIcon: Train, DirectionsCarIcon: DirectionsCar, LocalShippingIcon: LocalShipping, FlightIcon: Flight, HotelIcon: Hotel, LocalGasStationIcon: LocalGasStation, RestaurantIcon: Restaurant, LocalBarIcon: LocalBar,
    LocalCafeIcon: LocalCafe, FastfoodIcon: Fastfood, LocalDiningIcon: LocalDining, LocalPizzaIcon: LocalPizza, TwoWheelerIcon: TwoWheeler, PedalBikeIcon: PedalBike, SubwayIcon: Subway, TramIcon: Tram,
    LuggageIcon: Luggage, ConnectingAirportsIcon: ConnectingAirports, SailingIcon: Sailing, AnchorIcon: Anchor,

    // Casa & Vida
    ApartmentIcon: Apartment, SingleBedIcon: SingleBed, BedIcon: Bed, KingBedIcon: KingBed, ChairIcon: Chair, TableRestaurantIcon: TableRestaurant, BlenderIcon: Blender, CoffeeMakerIcon: CoffeeMaker, MicrowaveIcon: Microwave,
    CountertopsIcon: Countertops, DeckIcon: Deck, FenceIcon: Fence, FireplaceIcon: Fireplace, FlatwareIcon: Flatware, HardwareIcon: Hardware, LightbulbIcon: Lightbulb, OutletIcon: Outlet, ShowerIcon: Shower,
    WeekendIcon: Weekend, UmbrellaIcon: Umbrella, BeachAccessIcon: BeachAccess, PoolIcon: Pool, FitnessCenterIcon: FitnessCenter, SpaIcon: Spa, ChildFriendlyIcon: ChildFriendly, PetsIcon: Pets,
    HouseIcon: House, CottageIcon: Cottage, VillaIcon: Villa, LocationCityIcon: LocationCity, BusinessIcon: Business,
    DomainIcon: Domain, // <--- ADICIONADO

    // Saúde & Bem-Estar
    LocalHospitalIcon: LocalHospital, MedicalServicesIcon: MedicalServices, HealingIcon: Healing, MedicationIcon: Medication, BloodtypeIcon: Bloodtype, VaccinesIcon: Vaccines, MonitorHeartIcon: MonitorHeart,
    SelfImprovementIcon: SelfImprovement, PsychologyIcon: Psychology, AccessibilityNewIcon: AccessibilityNew, ElderlyIcon: Elderly, PregnantWomanIcon: PregnantWoman, StrollerIcon: Stroller,

    // Educação & Trabalho
    SchoolIcon: School, WorkIcon: Work, BusinessCenterIcon: BusinessCenter, BookIcon: Book, LibraryBooksIcon: LibraryBooks, ClassIcon: Class, CampaignIcon: Campaign, RecordVoiceOverIcon: RecordVoiceOver,
    CalculateIcon: Calculate, FunctionsIcon: Functions, ArchitectureIcon: Architecture, DesignServicesIcon: DesignServices, EngineeringIcon: Engineering, ScienceIcon: Science, BiotechIcon: Biotech,

    // Natureza & Comida
    ForestIcon: Forest, GrassIcon: Grass, ParkIcon: Park, PublicIcon: Public, AgricultureIcon: Agriculture, YardIcon: Yard, NaturePeopleIcon: NaturePeople, EnergySavingsLeafIcon: EnergySavingsLeaf,
    WaterDropIcon: WaterDrop, AirIcon: Air, WbSunnyIcon: WbSunny, NightsStayIcon: NightsStay, FilterVintageIcon: FilterVintage, TerrainIcon: Terrain, LandscapeIcon: Landscape,
    AppleIcon: Apple, BakeryDiningIcon: BakeryDining, BrunchDiningIcon: BrunchDining, CakeIcon: Cake, CookieIcon: Cookie, EggIcon: Egg, IcecreamIcon: Icecream, LiquorIcon: Liquor, LunchDiningIcon: LunchDining,
    NightlifeIcon: Nightlife, RamenDiningIcon: RamenDining, RiceBowlIcon: RiceBowl, SetMealIcon: SetMeal, TakeoutDiningIcon: TakeoutDining, TapasIcon: Tapas, WineBarIcon: WineBar,

    // Mídia & Comunicação
    PhotoCameraIcon: PhotoCamera, ImageIcon: Image, MusicNoteIcon: MusicNote, MovieIcon: Movie, VideocamIcon: Videocam, VolumeUpIcon: VolumeUp, VolumeDownIcon: VolumeDown, MicIcon: Mic, CallIcon: Call,
    SpeakerIcon: Speaker, RadioIcon: Radio, AlbumIcon: Album, LibraryMusicIcon: LibraryMusic, SubscriptionsIcon: Subscriptions, SmartDisplayIcon: SmartDisplay, WebIcon: Web, LanguageIcon: Language,
    TranslateIcon: Translate, RssFeedIcon: RssFeed, WifiIcon: Wifi, BluetoothIcon: Bluetooth, SignalCellularAltIcon: SignalCellularAlt, NetworkCheckIcon: NetworkCheck,

    // Outros & Específicos
    CategoryIcon: Category, LabelIcon: Label, PaletteIcon: Palette, AutoAwesomeIcon: AutoAwesome, StyleIcon: Style, ExtensionIcon: Extension, ToysIcon: Toys, SmartToyIcon: SmartToy, SportsEsportsIcon: SportsEsports,
    CasinoIcon: Casino, SportsSoccerIcon: SportsSoccer, SportsBasketballIcon: SportsBasketball, SportsTennisIcon: SportsTennis, EmojiEventsIcon: EmojiEvents, EmojiObjectsIcon: EmojiObjects, EmojiPeopleIcon: EmojiPeople,
    EmojiNatureIcon: EmojiNature, EmojiFoodBeverageIcon: EmojiFoodBeverage, EmojiTransportationIcon: EmojiTransportation, EmojiFlagsIcon: EmojiFlags, EmojiSymbolsIcon: EmojiSymbols,
    DiamondIcon: Diamond, // <--- ADICIONADO
    AddCircleOutlineIcon: AddCircleOutline, 
};

/**
 * Lista de ícones para uso em seletores (pickers).
 * Contém o nome (chave do iconComponentsMap) e o componente real do ícone.
 */
export const muiIconsForPickerList: { name: string; component: React.ElementType }[] =
    Object.entries(iconComponentsMap).map(([name, component]) => ({
        name,
        component,
    })).sort((a, b) => a.name.localeCompare(b.name));

/**
 * Lista apenas dos nomes dos ícones disponíveis.
 * Útil se você só precisa dos nomes para validação ou outras lógicas.
 */
export const availableIconNames: string[] = Object.keys(iconComponentsMap).sort();

/**
 * Ícone de fallback padrão, exportado para ser usado no GetMuiIcon caso nenhum fallback seja especificado.
 */
export const DefaultFallbackIcon = HelpOutline;