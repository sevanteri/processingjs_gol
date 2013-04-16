
int sizeX;
int sizeY;

int[][] grid;
int[][] newGrid;
int[][] change;
int paused = 0;
int boxW = boxH = 15;

boxColor = 0;
bgColor = 255;

String shape = "rect";

int blur = 0;

void setup() {
    size(screen.width, screen.height);
    background(bgColor);
    frameRate(4);

    sizeX = (int)(width/boxW);
    sizeY = (int)(height/boxH);

    grid = new int[sizeX][sizeY];
    change = new int[sizeX][sizeY];

    randomize();

    noStroke();
    ellipseMode(CORNER);
    
    fill(boxColor);
    calculateCells();
}

void draw() {
    if (blur==0) {
        background(bgColor);
    } else {
        fill(bgColor, 100-blur);
        rect(0,0,width,height);
        fill(boxColor);
    }
    paintCells();
    calculateCells();
} 
void randomize() {
    for (int i = 0; i < sizeX*sizeY; i++) {   
        grid[(int)random(sizeX)][(int)random(sizeY)] = 1;   
    }
}
void resize(w,h) {
    int newSizeX = (int)(w/boxW);
    int newSizeY = (int)(h/boxH);
    newGrid = new int[newSizeX][newSizeY];

    int xO = (int)((newSizeX-sizeX)/2);
    int yO = (int)((newSizeY-sizeY)/2);
    //console.log(xO,yO);

    for (int i=0; i<sizeX; i++) {
        for (int j=0; j<sizeY; j++) {
            if (grid[i][j] == 1) {
                try {
                    newGrid[i+xO][j+yO] = 1;
                } catch(e) {}
            }
        }
    }
    sizeX = newSizeX;
    sizeY = newSizeY;
    size(w,h);
    grid = newGrid;
    change = new int[sizeX][sizeY];
    //console.log(sizeX, sizeY, w,h);
    calculateCells();
}


int calculateCells() {
    for (int i = 0; i < sizeX; i++) { 
        for (int j = 0; j < sizeY; j++) { 
            int count = neighbors(i, j); 
            if (count == 3 && grid[i][j] == 0) { 
                change[i][j] = 1; 
            } 
            else if ((count < 2 || count > 3) && grid[i][j] == 1) { 
                change[i][j] = -1;
            } 
            else if (count > 3 && grid[i][j] == 0) {
                change[i][j] = 0;
            }
            else if ((count == 2)) { change[i][j] = 0; }
        } 
    } 
}
int paintCells() {
    for (int i = 0; i < sizeX; i++) { 
        for (int j = 0; j < sizeY; j++) { 
            if ((change[i][j] == 1) || (change[i][j] == 0 && grid[i][j] == 1)) { 
                grid[i][j] = 1; 
                cell(i, j); 
            } 
            if (change[i][j] == -1) { 
                grid[i][j] = 0; 
            } 
            change[i][j] = 0; 
        } 
    }
}

void mouseClicked() {
    int x = (int)(mouseX/boxW);
    int y = (int)(mouseY/boxH);

    if(mouseButton == CENTER) {togglePause();return;}
    if(mouseButton == RIGHT) {
        grid[x][y] = 1;
        cell(x, y);

        grid[(x + 1) % sizeX][y] = 1;
        cell(((x + 1) % sizeX), y);

        grid[x][(y + 1) % sizeY] = 1;
        cell(x, ((y + 1) % sizeY));
        
        grid[(x + sizeX - 1) % sizeX][y] = 1;
        cell(((x + sizeX - 1) % sizeX), y);

        grid[x][(y + sizeY - 1) % sizeY] = 1;
        cell(x,((y + sizeY - 1) % sizeY));

        calculateCells();
        return 0;
    }

    if (grid[x][y] == 0) {
        grid[x][y] = 1;
        cell(x,y);
    } else {
        grid[x][y] = 0;
        fill(bgColor);
        rect(x*boxW, y*boxH, boxW, boxH );
        fill(boxColor);
    }
    calculateCells();
}

void cell(int x, int y) {
    x *= boxW;
    y *= boxH;
    if (shape == "rect") {
        rect(x,y,boxW,boxH);
    }
    else if (shape == "ellipse") {
        ellipse(x,y,boxW,boxH);
    }
}

int neighbors(int x, int y) { 
  return grid[(x + 1) % sizeX][y] + 
         grid[x][(y + 1) % sizeY] + 
         grid[(x + sizeX - 1) % sizeX][y] + 
         grid[x][(y + sizeY - 1) % sizeY] + 
         grid[(x + 1) % sizeX][(y + 1) % sizeY] + 
         grid[(x + sizeX - 1) % sizeX][(y + 1) % sizeY] + 
         grid[(x + sizeX - 1) % sizeX][(y + sizeY - 1) % sizeY] + 
         grid[(x + 1) % sizeX][(y + sizeY - 1) % sizeY]; 
}

int clearStage() {
    background(bgColor);
    grid = new int[sizeX][sizeY];
    change = new int[sizeX][sizeY];
}
int[][] getGrid() {
    return grid;
}
int togglePause() {
    if (paused) {
        loop();
        paused=0;
    } else {
        noLoop();
        paused=1;
    }
}
int setShape(String s) {shape=s;}
int setShapeWidth(int w) {boxW=w;resize(width,height);}
int setShapeHeight(int h) {boxH=h;resize(width,height);}
int setFramerate(int f) {frameRate(f);}
int setBlur(int b) {blur=b;}
