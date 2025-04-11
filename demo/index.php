<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charset="utf-8" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <meta name= "viewport" content= "width = device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <style>
            body {
                font-family: sans-serif;
                background: #9b1915;
                padding:0rem;
                margin: 0;
            }
            .list {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                padding: 1rem;
                flex-direction: column;
                @media screen and (min-width: 800px) {
                    flex-direction: row;
                    
                }
            }
            div.item {
                margin: 0.5em;
                background-color: white;
                padding: 0.5em;
                padding: 0.5em;
                border-radius: 0.5em;
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
                    background-color: #D7D7D7;
                    ul {
                    height:0rem;
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
            }
         
            h2 {
                font-size: 1rem;
                text-align: left;
                padding:0;
                padding-left:1rem;
                margin:0;
                text-transform: uppercase;
                color: #9b1915;
                &:before {
                    content: counter(css-counter) ". "; 
                }
            }
            
            div.item.old h2:before {
               content: "";
            }
            ul {
                padding:0;
                margin:0;  
                list-style-type: none;
                display:flex;
            }
            li {
                background-color: rgba(0,0,0, 0.1);
                margin: 0.5em;
                border-radius: 0.5em;
                text-align:center;
              
                a {
                    padding: 0.5em;
                    text-decoration: none;
                    text-shadow: 0px -1px 0px rgba(0,0,0, 0.2);
                    display:block;
                    min-width: 4em;
                    color: #0e4d74;
                }
               
            }
            li:hover {
                background-color:white;
                box-shadow: 0px 0px 7px 0px rgba(0,0,0, 0.2);
                a {
                    text-shadow: 0px 1px 0px rgba(0,0,0, 0.2);
                }
               
            }
          
            .fa {
                font-size: 2em;
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

$data =  array_diff(scandir("data"), array('..', '.', '.DS_Store'));

$icons = array(
    "pdf" => "fa-file-pdf-o",
    "md" => "fa-file-text-o",
    "mp3" => "fa-volume-up"
);

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
        echo "<div class='item" . ($ext == "new" ? " new" : "") . " collapsed' onclick=\"toggle(this)\">";        echo "<h2>".str_replace ("_", " ", $item)."</h2>";
        
        $itemdata =  array_diff(scandir("data/".$item), array('..', '.', '.DS_Store'));
       
        
        uasort($itemdata, 'sortByExtension');
        echo "\t<ul>\n";
        foreach ($itemdata as $itemitem) {  
            $ext = pathinfo($itemitem, PATHINFO_EXTENSION);
            $fileName = pathinfo($itemitem, PATHINFO_FILENAME);
            echo "\t\t<li>";
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

console.log();

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

