<?php

require_once 'connect.php';

/**
 *@var PDO $db
 */

//$sql_select_questions = "SELECT * from questions q inner join answers a on q.id = a.questions_id";
$sql_select_questions = "SELECT * from questions";

$query_select = $db->query($sql_select_questions);

$questions = $query_select->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($questions, JSON_UNESCAPED_UNICODE);
