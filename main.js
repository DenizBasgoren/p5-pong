/*
Notlar:

Koordinat sistemi, canvasın sol üst köşesinden başlar. X ekseni matematikte olduğu gibi soldan sağa artarken Y ekseni yukarıdan aşağı artar. Z ekseni ise canvas düzleminin dışına doğrudur (Sağ el kuralına uygundur)

Renkler RGB Renk uzayında 3 sayıyla temsil edilirler: R (Kırmızıya yakınlık), G (Yeşile yakınlık), B (Maviye yakınlık). Bu sayılar 0-255 arasıdır. Örneğin,
RGB(0,0,0) = siyah
RGB(255,255,255) = beyaz
RGB(250, 0, 0) = kırmızı
RGB(0, 250, 0) = yeşil
RGB(0, 0, 250) = mavi
RGB(250, 250, 0) = sarı

scale(K,L) fonksiyonu koordinat sistemini büyütür/küçültür.
x>1 ise sistem büyür. Dolayısıyla o sistemede x=a ile x=b arası mesafe K kadar büyümüş olur.
0<x<1 ise sistem küçülür.
x<0 ise sistem x eksenine göre 180 derece döner. (Simetriği alınır)

scale, fill gibi fonksiyonları etkisi sadece tek bir draw döngüsü süresince geçerlidir. Bu yüzden scale'i her karede uygulamak için draw fonksiyonunun içine yazarız.

*/



// DEGISKENLER

// let TOP = { X: 500, Y: 250, VX: -5, VY: 2, C: 20}
let TOP = yeniTop()
let SKOR = {SOL: 0, SAG: 0}
let RAKET = {
    SOL: {
        X: 50,
        Y: 250,
        W: 20,
        H: 100
    },
    SAG: {
        X: 950,
        Y: 250,
        W: 20,
        H: 100
    }
}

// P5 TARAFINDAN ONCE BURASI CALISTIRILIR (BIR KERE)
function setup() {
    // createCanvas( 1000 , 500 )
    createCanvas( windowWidth, windowHeight)
    background(0,0,0)
    fill(255, 0, 0)
}

// SETUP BITINCE BURASI TEKRAR TEKRAR CALISTIRILIR
function draw() {
    scale( windowWidth/1000 , windowHeight/500 )
    background(0,0,0)
    
    topuCiz()
    topuGuncelle()
    skoruCiz()
    raketleriCiz()
    raketleriGuncelle()
}

// PENCERE BOYUTU DEGISTIRILINCE BU FONKSIYON P5 TARAFINDAN TETIKLENIR
function windowResized() {
    resizeCanvas( windowWidth, windowHeight )
}

function topuGuncelle() {
    TOP.X = TOP.X + TOP.VX
    TOP.Y = TOP.Y + TOP.VY

    if ( TOP.Y + TOP.C/2 > 500) {
        // TOP.VY = TOP.VY * -1
        TOP.VY = -Math.abs( TOP.VY )
    }
    else if (TOP.Y - TOP.C/2 < 0) {
        // TOP.VY = TOP.VY * -1
        TOP.VY = Math.abs( TOP.VY )
    }

    if (TOP.X - TOP.C/2 < 0) {
        TOP = yeniTop()
        SKOR.SAG++
    }
    else if ( TOP.X + TOP.C/2 > 1000) {
        TOP = yeniTop()
        SKOR.SOL++
    }

    // collision detection algorithm
    // soldaki rakete degiyor mu?
    if ((TOP.X - TOP.C/2 < RAKET.SOL.X + RAKET.SOL.W)
    && (TOP.Y - TOP.C/2 < RAKET.SOL.Y + RAKET.SOL.H)
    && (TOP.Y + TOP.C/2 > RAKET.SOL.Y)
    && (TOP.X + TOP.C/2 > RAKET.SOL.X)) {
        TOP.VX = Math.abs( TOP.VX )
    }

    // sagdaki rakete degiyor mu?
    // not: top ayni anda sag ve sol rakete degemeyecegi icin burada if yerine "else if" kullanilabilirdi
    if ((TOP.X - TOP.C/2 < RAKET.SAG.X + RAKET.SAG.W)
    && (TOP.Y - TOP.C/2 < RAKET.SAG.Y + RAKET.SAG.H)
    && (TOP.Y + TOP.C/2 > RAKET.SAG.Y)
    && (TOP.X + TOP.C/2 > RAKET.SAG.X)) {
        TOP.VX = -Math.abs( TOP.VX )
    }
}

function topuCiz() {
    fill(255, 255, 255)
    circle( TOP.X, TOP.Y, TOP.C)
}

function yeniTop() {

    let v, a
    v = 20
    a = Math.random() * 2 * 3.14

    return { X: 500,
        Y: 250,
        VX: v * Math.cos(a), // DUZELTME
        VY: v * Math.sin(a), // DUZELTME
        C: 20}
}

function skoruCiz() {
    fill(0, 255, 0)
    textSize(100)
    text(SKOR.SOL, 250, 100)
    text(SKOR.SAG, 750, 100)
}

function raketleriCiz() {
    fill(255, 255, 255)
    rect(RAKET.SAG.X, RAKET.SAG.Y, RAKET.SAG.W, RAKET.SAG.H)
    rect(RAKET.SOL.X, RAKET.SOL.Y, RAKET.SOL.W, RAKET.SOL.H)
}

function raketleriGuncelle() {

    // sol raket icin klavyeyi kontrol edecegizz

    if (keyIsPressed === true && (key === 'w' || keyCode === 38)) {
        if( RAKET.SOL.Y > 0) {
            RAKET.SOL.Y = RAKET.SOL.Y - 10
        }
    }
    else if (keyIsPressed === true && (key === 's' || keyCode === 40)) {
        if ( RAKET.SOL.Y + RAKET.SOL.H < 500) {
            RAKET.SOL.Y = RAKET.SOL.Y + 10
        }
    }

    // eger bu satir varsa, raket her zaman farenin durdugu yere gidecek.
    // dolayisiyla klavye kodu gecersiz olacak.
    RAKET.SOL.Y = mouseY * 500/windowHeight


    // sag icin bilgisayar (kod) karar versin

    if (RAKET.SAG.Y + RAKET.SAG.H/2 > TOP.Y) {
        if( RAKET.SAG.Y > 0) {
            RAKET.SAG.Y = RAKET.SAG.Y - 10
        }
    }
    else {
        if ( RAKET.SAG.Y + RAKET.SAG.H < 500) {
            RAKET.SAG.Y = RAKET.SAG.Y + 10
        }
    }

    

}