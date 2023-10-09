<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <style>
            body {
                font-family: sans-serif;
                display: flex;
                flex-wrap: wrap;
                background: #9b1915;
                counter-reset: css-counter 0; 
            }
            div.item {
                margin: 0.5em;
                flex-basis: 20vw;
                background-color: white;
                padding: 0.5em;
                border-radius: 1em;
                border: 1px solid black;
            }
            div.item:not(.old) {
                counter-increment: css-counter 1;
            }
            div.item.old {
                background-color: gray;
            }
            h2 {
                font-size: 1rem;
                text-align:center;
                padding:0;
                margin:0;
                text-transform: uppercase;
                color: #9b1915;
       
            }
            h2:before {
                content: counter(css-counter) ". "; 
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
                border-radius: 1em;
                text-align:center;
                border: 1px solid #DEDEDE;
               
            }
            li:hover {
                background-color:white;
                box-shadow: 0px 0px 7px 0px rgba(0,0,0, 0.2);
                border: 1px solid rgba(0,0,0, 0.5);
  
            }
            li a {
                padding: 0.5em;
                text-decoration: none;
                display:block;
                min-width: 4em;
                color: #0e4d74;
            }
            .fa {
                font-size: 2em;
            }
        </style>
    </head>

    <body>
    
<? 

$data =  array_diff(scandir("data"), array('..', '.', '.DS_Store'));

$icons = array(
    "pdf" => "fa-file-pdf-o",
    "html" => "fa-file-text-o",
    "mp3" => "fa-volume-up"
);


foreach ($data as $item) {
    if ($item != "." || $item != "..") {
       
        $ext = pathinfo($item, PATHINFO_EXTENSION);

        if ($ext == "old") {
            echo "<div class='item old'>";
        }
        else {
            echo "<div class='item'>";
        }

        echo "<h2>".str_replace ("_", " ", $item)."</h2>";
        
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

</body>
</html>