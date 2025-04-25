<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charset="utf-8" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <meta name= "viewport" content= "width = device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@900&family=Oswald:wght@200;700&display=swap');


            body {
         
                background: #9b1915;
                padding:0rem;
                margin: 0;
                font-family: 'Oswald', sans-serif;
        
            }
            .list {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                padding: 0rem;
                flex-direction: column;
                @media screen and (min-width: 800px) {
                    flex-direction: row;
                }
            }
            div.item {
                margin: 0.1em;
                background-color: white;
                padding:  0.5rem 0 0.5rem 0;
                border-radius: 3px
                border: 1px solid gray;
                box-shadow: 0px 0px 7px 0px rgba(0,0,0, 0.2);
                text-shadow: 0px 0px 7px 0px rgba(0,0,0, 0.2);
               
                @media screen and (min-width: 800px) {
                  width: 44rem;
                }
               
                &:not(.old) {
                    counter-increment: css-counter 1;
                }
                &.collapsed {
                    ul {
                        max-height:0;
                        overflow: hidden;
                    }}
                &.old {
                    background-color: gray;
                }
                &.new {
                    background-color: lightgreen;
                }
                &.selected {
                    background-color: lightblue ;
       
                }
                cursor: pointer;
                box-shadow: inset 0px 0px 4px 0px rgba(0,0,0, 0.6);
            }
         
            h2 {
                font-size: 1rem;
                text-align: left;
                padding:0;
                padding-left:0.5rem;
                margin:0;
                text-transform: uppercase;
                color: #9b1915;
                text-shadow: 0px 1px 0px  rgba(0,0,0, 0.4);
              
               
                &:before {
                    content: "◢ " counter(css-counter) ". " ; 
                }
                .collapsed &:before  {
                    content: "▷ " counter(css-counter) ". " ; 
                }
             
            }
            
            ul {
                padding:0;
                margin:0;  
                list-style-type: none;
                display:flex;
                flex-wrap: wrap;
                transition: max-height 1s ease;
                max-height: 200px;
            }
            li {
             
                margin: 0.25em;
                border-radius: 0.5em;
                text-align:center;
               
              
                a {
                    padding: 0.25em;
                    text-decoration: none;
                    text-shadow: 0px -1px 0px rgba(0,0,0, 0.2);
                    display:block;
                    min-width: 2em;
                    min-width: 2em;
                    color:rgb(107, 107, 107);
                    i.fa {
                        font-size: 1.5em;
                    }
                
                }
                &.audio {
                    a {  color:rgb(21, 61, 155);}
                }
                &.pdf {
                    a {  color: #9b1915;}
                
                }
                &:hover {
                    background-color:white;
                    box-shadow: 0px 0px 7px 0px rgba(0,0,0, 0.2);
                    a {
                        text-shadow: 0px 1px 0px rgba(0,0,0, 0.2);
                    }
                }
            }
            #event {
                background-color: white;
                padding:1rem;  
                box-shadow: 4px 0px 7px 0px rgba(0,0,0, 0.2);  
            }

        </style>

    </head>
    <body>      
        <div id="event">Načítání...</div>
        <script>
        
            const API_KEY = "AIzaSyBxSP7qbnpzphJzT3yeRoc0XmreUx9DM2I"; // Nahraď vlastním API klíčem
            const CALENDAR_ID = "48jdqagdt2v2uhhd8afgcn2fc8@group.calendar.google.com"; 
            const URL = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${new Date().toISOString()}&maxResults=1&singleEvents=true&orderBy=startTime`;

            function loadCalendar() {
                fetch(URL)
                    .then(response => response.json())
                    .then(data => {
                        const event = data.items ? data.items[0] : null;
                        if (event) {
                            const title = event.summary;
                            const when = event.start.dateTime || event.start.date;
                            document.getElementById("event").innerHTML = `<i class="fa fa-solid fa-calendar"></i> <b>${title}</b>  ${new Date(when).toLocaleString()}  <a href="https://calendar.google.com/calendar/u/0/embed?src=48jdqagdt2v2uhhd8afgcn2fc8@group.calendar.google.com&ctz=Europe/Prague">Kalendář</a>`;
                        } else {
                            document.getElementById("event").innerHTML = "Žádné nadcházející události.";
                        }
                    })
                    .catch(error => {
                        console.error("Chyba při načítání kalendáře:", error);
                        document.getElementById("event").innerHTML = "Chyba při načítání dat.";
                    });
            }

            loadCalendar();
        </script>
        <div class="list">
<? 
require_once './getid3/getid3.php';
$data =  array_diff(scandir("data"), array('..', '.', '.DS_Store'));

$icons = array(
    "pdf" => "fa-file-pdf-o",
    "md" => "fa-file-text-o",
    "mp3" => "fa-volume-up"
);
$clss = array(
    "pdf" => "pdf",
    "md" => "text",
    "mp3" => "audio"
);

$getID3 = new getID3;

function sortByExtension($a, $b) {
    $extA = pathinfo($a, PATHINFO_EXTENSION);
    $extB = pathinfo($b, PATHINFO_EXTENSION);
    return strcmp($extA, $extB);
}

foreach ($data as $item) {
    if ($item != "." || $item != "..") {
        $ext = pathinfo($item, PATHINFO_EXTENSION);
        if ($ext == "old") {
            continue;
        }

        $itemdata =  array_diff(scandir("data/".$item), array('..', '.', '.DS_Store'));
        $playtime = "";

        foreach ($itemdata as $itemitem) { 
            $ext = pathinfo($itemitem, PATHINFO_EXTENSION);
            $fileName = pathinfo($itemitem, PATHINFO_FILENAME);
            if ($ext == "mp3" && $fileName == "demo") {
                $filePath = "./data/$item/$itemitem";
                echo $filePath;
                $fileInfo = $getID3->analyze($filePath);
                if (isset($fileInfo['playtime_string'])) {
                    $playtime = $fileInfo['playtime_string'] ;
                }
            }
        }
        
        echo "<div class='item" . ($ext == "new" ? " new" : "") . " collapsed' onclick=\"toggle(this)\">";
        echo "<h2>".str_replace ("_", " ", $item)."  $playtime </h2>";
        
        uasort($itemdata, 'sortByExtension');
        echo "\t<ul>\n";
        foreach ($itemdata as $itemitem) {  
            $ext = pathinfo($itemitem, PATHINFO_EXTENSION);
            $fileName = pathinfo($itemitem, PATHINFO_FILENAME);
            echo "\t\t<li class='$clss[$ext]'>";
            if ($ext == "md") {
                echo "<a href=\"text.html?song=$item\">";
            }
            else {
                echo "<a href=\"data/$item/$itemitem\">";
            }
            echo "<i class='fa " . $icons[$ext] . "'></i><br>";
            echo "$fileName</a></li>\n";
        }
        echo "\t</ul>\n</div>\n";
    }
}

foreach ($data as $item) {
    if ($item != "." || $item != "..") {
        $ext = pathinfo($item, PATHINFO_EXTENSION);
        if ($ext != "old") {
            continue;
        }
        echo "<div class='item" . ($ext == "old" ? " old" : "") . " collapsed' onclick=\"toggle(this)\">";        echo "<h2>".str_replace ("_", " ", $item)."</h2>";
        
        $itemdata =  array_diff(scandir("data/".$item), array('..', '.', '.DS_Store'));
        echo "\t<ul>\n";
        foreach ($itemdata as $itemitem) {  
            $ext = pathinfo($itemitem, PATHINFO_EXTENSION);
            $fileName = pathinfo($itemitem, PATHINFO_FILENAME);
            echo "\t\t<li>";
            echo "<a href=\"data/$item/$itemitem\">";
            echo "<i class='fa " . $icons[$ext] . "'></i><br>";
            echo "$fileName</a></li>\n";
        }
        echo "\t</ul>\n</div>\n";
    }
}
?>
</div>
<script>

window.location.search.replace("?","").split("&").forEach(function (item) {
   let [param, values] = item.split("=");

   if (param === "select" ) {
       values.split(",")?.forEach( (value) => {
           let el = document.querySelector(`div.item:nth-child(${value})`);
           if (el) {
               el.classList.add("selected");
           }
       });
   }
});

function toggle(el) {
    el.classList.toggle("collapsed")
}
</script>
</body>
</html>

